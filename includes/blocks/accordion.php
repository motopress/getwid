<?php

namespace Getwid\Blocks;

class Accordion {

    private $blockName = 'getwid/accordion';

    public function __construct() {
        add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );
        add_filter( 'getwid/editor_blocks_css/dependencies', [ $this, 'block_editor_styles' ] );

        register_block_type(
            $this->blockName,
            array(
                'render_callback' => [ $this, 'render_block' ]
            )
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

    public function block_editor_scripts($scripts) {

		//jquery-ui-accordion.min.js
        if ( ! in_array( 'jquery-ui-accordion', $scripts ) ) {
            array_push( $scripts, 'jquery-ui-accordion' );
        }

        return $scripts;
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

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }

		//jquery-ui-accordion.min.js
        if ( ! wp_script_is( 'jquery-ui-accordion', 'enqueued' ) ) {
            wp_enqueue_script('jquery-ui-accordion');
        }
    }

    public function render_block( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }    
}

new \Getwid\Blocks\Accordion();