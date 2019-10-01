<?php

namespace Getwid\Blocks;

class VideoPopup {

    private $blockName = 'getwid/video-popup';

    public function __construct() {

        add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );
        add_filter( 'getwid/editor_blocks_css/dependencies', [ $this, 'block_editor_styles' ] );

        register_block_type(
            $this->blockName,
            array(
                'render_callback' => [ $this, 'render_block' ]
            )
        );

        //Register JS/CSS assets
        wp_register_style(
            'magnific-popup',
            getwid_get_plugin_url( 'vendors/magnific-popup/magnific-popup.css' ),
            [],
            '1.1.0'
        );

        wp_register_script(
            'magnific-popup',
            getwid_get_plugin_url( 'vendors/magnific-popup/jquery.magnific-popup.min.js' ),
            [ 'jquery' ],
            '1.1.0',
            true
        );         
    }

    public function block_editor_styles($styles) {

        if ( ! in_array( 'magnific-popup', $styles ) ) {
            array_push( $styles, 'magnific-popup' );
        }

        return $styles;
    }

    public function block_editor_scripts($scripts) {
       
        if ( ! in_array( 'magnific-popup', $scripts ) ) {
            array_push( $scripts, 'magnific-popup' );
        }

        return $scripts;
    }

    private function block_frontend_assets() {
        if ( is_admin() ) {
            return;
        }
    
        if ( ! wp_style_is( 'magnific-popup', 'enqueued' ) ) {
            wp_enqueue_script('magnific-popup');
        }
    
        if ( ! wp_style_is( 'magnific-popup', 'enqueued' ) ) {
            wp_enqueue_style('magnific-popup');
        }
    }

    public function render_block( $attributes, $content ) {
        $this->block_frontend_assets();
        return $content;
    }    
}

new \Getwid\Blocks\VideoPopup();