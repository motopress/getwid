<?php

namespace Getwid\Blocks;

class ImageBox {

    private $blockName = 'getwid/image-box';

    public function __construct() {

        $settings = \Getwid\Settings::getInstance();

        add_filter( 'getwid/blocks_style_css/dependencies', [ $this, 'block_frontend_styles' ] );

        register_block_type(
            'getwid/image-box'
        );

        //Register JS/CSS assets
        wp_register_style(
            'animate',
            getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
            [],
            '3.7.0'
        );        
    }

    public function block_frontend_styles($styles) {

		//animate.min.css
        if ( ! in_array( 'animate', $styles ) ) {
            array_push( $styles, 'animate' );        
        }

        return $styles;
    }
}

new \Getwid\Blocks\ImageBox();