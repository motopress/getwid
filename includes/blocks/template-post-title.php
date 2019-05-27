<?php

function render_getwid_template_post_title( $attributes ) {
    $block_name = 'wp-block-getwid-template-post-title';
    $wrapper_class = $block_name;

    $wrapper_style = '';
    //Classes
    if ( isset( $attributes['align'] ) ) {
        $wrapper_class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['textAlignment']) ) {
        $wrapper_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }      

    ob_start();
    ?>    
        <div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>        
           
            <?php if ($attributes['linkTo'] == 'post'){ ?>
                <a href="<?php echo esc_url(get_permalink()); ?>">
            <?php } ?>  

                <?php echo the_title( '<'.esc_attr($attributes['headerTag']).'>', '</'.esc_attr($attributes['headerTag']).'>', false ); ?>

            <?php if ($attributes['linkTo'] == 'post'){ ?>
                </a>
            <?php } ?>
            
        </div>
    <?php

    $result = ob_get_clean();
    return $result;    
}
register_block_type(
    'getwid/template-post-title',
    array(
        'attributes' => array(
            'linkTo' => array(
                'type' => 'string',
                'default' => 'none',
            ),            
            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
                'default' => 'left',
            ),
            'headerTag' => array(
                'type' => 'string',
                'default' => 'h2',
            ),
        ),
        'render_callback' => 'render_getwid_template_post_title',
    )
);