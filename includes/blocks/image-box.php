<?php

namespace Getwid\Blocks;

class ImageBox {

    private $blockName = 'getwid/image-box';

    public function __construct() {

        $settings = \Getwid\Settings::getInstance();

        add_filter( 'getwid/blocks_style_css/dependencies', [ $this, 'block_frontend_styles' ] );
        add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );

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

    public function block_editor_scripts($scripts) {

		//functions.min.js
        if ( ! in_array( 'getwid-functions', $scripts ) ) {
            array_push( $scripts, 'getwid-functions' );
        }

        return $scripts;
    }

    public function block_frontend_styles($styles) {

		//animate.min.css
        if ( ! in_array( 'animate', $styles ) ) {
            array_push( $styles, 'animate' );        
        }

        return $styles;
    }  

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }

		//functions.min.js
        if ( ! wp_script_is( 'getwid-functions', 'enqueued' ) ) {
            wp_enqueue_script( 'getwid-functions' );
        }
    }

    public function render_block( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }    
}

new \Getwid\Blocks\ImageBox();