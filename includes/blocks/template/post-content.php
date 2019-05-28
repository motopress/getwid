<?php

function render_getwid_template_post_content( $attributes ) {
    $block_name = 'wp-block-getwid-template-post-content';
    $wrapper_class = $block_name;

    $wrapper_style = '';
    //Classes
    if ( isset( $attributes['align'] ) ) {
        $wrapper_class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['textAlignment']) ) {
        $wrapper_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }

    $contentLength = isset( $attributes['contentLength'] ) ? $attributes['contentLength'] : false;

    $current_post = get_post( get_the_ID() );

    ob_start();
    ?>    
        <div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>

            <div>
                <?php if ( $attributes['showContent'] == 'excerpt' ) {
                    echo esc_html( wp_trim_words( get_the_excerpt(), $contentLength ) );
                } elseif ($attributes['showContent'] == 'content'){
                    echo get_the_content();
                } elseif ($attributes['showContent'] == 'full'){
                    wp_kses_post( html_entity_decode( $current_post->post_content, ENT_QUOTES, get_option( 'blog_charset' ) ) );
                } ?>
            </div>

        </div>
    <?php

    $result = ob_get_clean();
    return $result;    
}
register_block_type(
    'getwid/template-post-content',
    array(
        'attributes' => array(
            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
                'default' => 'left',
            ),
            'showContent' => array(
                'type' => 'string',
                'default' => 'excerpt',
            ),            
            'contentLength' => array(
                'type' => 'number',
                'default' => apply_filters('excerpt_length', 55),
            ),
        ),
        'render_callback' => 'render_getwid_template_post_content',
    )
);