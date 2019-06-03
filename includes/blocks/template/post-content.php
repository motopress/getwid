<?php

function render_getwid_template_post_content( $attributes ) {
    //Not BackEnd render if we view from template page
    if (get_post_type() == 'getwid_template_part'){
        return;
    }

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

    $is_back_end = \defined( 'REST_REQUEST' ) && REST_REQUEST && ! empty( $_REQUEST['context'] ) && 'edit' === $_REQUEST['context'];

    //Link style & class
    //Color
    if (isset( $attributes['textColor']) || isset( $attributes['customTextColor'] )){
        preg_match('/^#/', $attributes['textColor'], $matches);
        //HEX
        $textColorHEX = '';
        if (isset($matches[0])){
            $textColorHEX = $attributes['textColor'];
        }
        //String
        else {
            $get_colors = get_theme_support('editor-color-palette')[0];
            foreach ($get_colors as $key => $value) {
                if ($value['slug'] == $attributes['textColor']){
                    $textColorHEX =  $value['color'];
                }
            }        
        }
        if ($is_back_end){
            $wrapper_style .= 'color: '.(isset( $attributes['customTextColor'] ) ? $attributes['customTextColor'] : $textColorHEX).';';
        } else {
            if (isset($attributes['customTextColor'])){
                $wrapper_style .= 'color: '.$attributes['customTextColor'].';';
            } else {
                $wrapper_class .= ' has-text-color has-' . $attributes['textColor'] . '-color';
            }
        }
    }
    $wrapper_style = trim($wrapper_style);
    $wrapper_class = trim($wrapper_class);

    ob_start();
    ?>
	<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
		<?php if ( $attributes['showContent'] == 'excerpt' ) {
			echo esc_html( wp_trim_words( get_the_excerpt(), $contentLength ) );
		} elseif ($attributes['showContent'] == 'content'){
            echo apply_filters( 'the_content', get_the_content(get_the_ID()) );
		} elseif ($attributes['showContent'] == 'full'){
			echo wp_kses_post( html_entity_decode( $current_post->post_content, ENT_QUOTES, get_option( 'blog_charset' ) ) );
		} ?>
	</div>
    <?php

    $result = ob_get_clean();

    return $result;
}
register_block_type(
    'getwid/template-post-content',
    array(
        'attributes' => array(
            //Colors
            'textColor' => array(
                'type' => 'string',
            ),
            'customTextColor' => array(
                'type' => 'string',
            ),
            //Colors

            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
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