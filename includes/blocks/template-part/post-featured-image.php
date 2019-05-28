<?php

function render_getwid_template_post_featured_image( $attributes ) {
    $block_name = 'wp-block-getwid-template-post-featured-image';
    $wrapper_class = $block_name;

    $wrapper_style = '';
    //Classes
    if ( isset( $attributes['align'] ) ) {
        $wrapper_class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['textAlignment']) ) {
        $wrapper_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }     
    
    $imageSize = ( ( isset($attributes['imageSize']) && $attributes['imageSize'] ) ? $attributes['imageSize'] : 'post-thumbnail');

    ob_start();
    ?>    
        <div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
            
            <?php if ($attributes['linkTo'] == 'post'){ ?>
                <a href="<?php echo esc_url(get_permalink()); ?>">
            <?php } ?>

                <?php the_post_thumbnail( $imageSize, array('alt' => the_title_attribute( 'echo=0' ))); ?>            
            
            <?php if ($attributes['linkTo'] == 'post'){ ?>
                </a>
            <?php } ?>
        </div>
    <?php

    $result = ob_get_clean();
    return $result;    
}
register_block_type(
    'getwid/template-post-featured-image',
    array(
        'attributes' => array(
            'linkTo' => array(
                'type' => 'string',
                'default' => 'none',
            ),             
            'align' => array(
                'type' => 'string',
            ),
            'imageSize' => array(
                'type' => 'string',
                'default' => 'large',
            ),            
        ),
        'render_callback' => 'render_getwid_template_post_featured_image',
    )
);