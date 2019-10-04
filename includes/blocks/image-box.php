<?php

namespace Getwid\Blocks;

class ImageBox {

    private $blockName = 'getwid/image-box';

    public function __construct() {

        $settings = \Getwid\Settings::getInstance();

        add_filter( 'getwid/editor_blocks_css/dependencies', [ $this, 'block_editor_styles' ] );
        add_filter( 'getwid/frontend_blocks_css/dependencies', [ $this, 'block_frontend_styles' ] );

        register_block_type(
            $this->blockName,
            array(
                'render_callback' => [ $this, 'render_block' ]
            )
        );

        //Register JS/CSS assets
        wp_register_script(
            'getwid-functions',
            getwid_get_plugin_url( 'vendors/getwid/functions.min.js' ),
            [],
            $settings->getVersion(),
            true
        );

        wp_register_style(
            'animate',
            getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
            [],
            '3.7.0'
        );        
    }

    public function block_editor_styles($styles) {

        if ( ! in_array( 'animate', $styles ) ) {
            array_push( $styles, 'animate' );
        }

        return $styles;
    }

    public function block_frontend_styles($styles) {

        if ( ! in_array( 'animate', $styles ) ) {
            array_push( $styles, 'animate' );        
        }

        return $styles;
    }  

    private function block_frontend_assets() {
        if ( is_admin() ) {
            return;
        }

        if ( ! wp_script_is( 'getwid-functions', 'enqueued' ) ) {
            wp_enqueue_script( 'getwid-functions' );
        }
    
        if ( ! wp_style_is( 'animate', 'enqueued' ) ) {
            wp_enqueue_style( 'animate' );
        }
    }

    public function render_block( $attributes, $content ) {
        $this->block_frontend_assets();
        return $content;
    }    
}

new \Getwid\Blocks\ImageBox();