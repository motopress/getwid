<?php

namespace Getwid\Blocks;

class IconBox {

    private $blockName = 'getwid/icon-box';

    public function __construct() {

        $settings = \Getwid\Settings::getInstance();

        add_filter( 'getwid/editor_blocks_css/dependencies', [ $this, 'block_editor_styles' ] );
        add_filter( 'getwid/blocks_style_css/dependencies', [ $this, 'block_frontend_styles' ] );

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

        wp_register_style(
            'fonticonpicker-base-theme',
            getwid_get_plugin_url('vendors/fonticonpicker/react-fonticonpicker/dist/fonticonpicker.base-theme.react.css'),
            null,
            '1.2.0'
        );

        wp_register_style(
            'fonticonpicker-react-theme',
            getwid_get_plugin_url('vendors/fonticonpicker/react-fonticonpicker/dist/fonticonpicker.material-theme.react.css'),
            null,
            '1.2.0'
        );        
    }

    public function block_editor_styles($styles) {

        //fonticonpicker.base-theme.react.css
		if ( ! in_array( 'fonticonpicker-base-theme', $styles ) ) {
            array_push( $styles, 'fonticonpicker-base-theme' );
        }

        //fonticonpicker.material-theme.react.css
		if ( ! in_array( 'fonticonpicker-react-theme', $styles ) ) {
            array_push( $styles, 'fonticonpicker-react-theme' );
        }           

        return $styles;
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

new \Getwid\Blocks\IconBox();