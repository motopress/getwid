<?php

namespace Getwid\Blocks;

class PostFeaturedImage {

    private $block_name = 'getwid/template-post-featured-image';

    public function __construct() {

        register_block_type(
            $this->block_name,
            array(
                'attributes' => array(
                    'linkTo' => array(
                        'type' => 'string',
                        'default' => 'none'
                    ),
                    'align' => array(
                        'type' => 'string'
                    ),
                    'imageSize' => array(
                        'type' => 'string',
                        'default' => 'large'
                    ),
        
                    'className' => array(
                        'type' => 'string'
                    ),           
                ),
                'render_callback' => [ $this, 'render_template_post_featured_image' ]
            )
        );
    }

    public function render_template_post_featured_image( $attributes, $content ) {
        //Not BackEnd render if we view from template page
        if ( ( get_post_type() == \Getwid\PostTemplatePart::$postType ) || ( get_post_type() == 'revision' ) ) {
            return $content;
        }
    
        $block_name = 'wp-block-getwid-template-post-featured-image';
        $wrapper_class = $block_name;
    
        if ( isset( $attributes[ 'className' ] ) ) {
            $wrapper_class .= ' ' . esc_attr( $attributes[ 'className' ] );
        }
    
        $wrapper_style = '';
        //Classes
        if ( isset( $attributes[ 'align' ] ) ) {
            $wrapper_class .= ' align' . $attributes[ 'align' ];
        }
    
        $imageSize = ( ( isset( $attributes[ 'imageSize' ] ) && $attributes[ 'imageSize' ] ) ? $attributes[ 'imageSize' ] : 'post-thumbnail' );
    
        $result = '';
    
        $extra_attr = array(
            'wrapper_class' => $wrapper_class,
            'wrapper_style' => $wrapper_style,
            'imageSize' => $imageSize
        );
    
        if ( has_post_thumbnail() ) {
            ob_start();
            
            getwid_get_template_part( 'template-parts/post-featured-image', $attributes, false, $extra_attr );
    
            $result = ob_get_clean();
        }
    
        return $result;
    }
}

new \Getwid\Blocks\PostFeaturedImage();