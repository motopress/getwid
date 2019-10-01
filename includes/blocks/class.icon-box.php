<?php

namespace Getwid\Blocks;

class IconBox {

    private $blockName = 'getwid/icon-box';

    public function __construct() {

        add_filter( 'getwid/editor_blocks_css/dependencies', [ $this, 'block_editor_styles' ] );

        register_block_type(
            $this->blockName,
            array(
                'editor_script' => 'getwid-blocks-editor-js',
                'editor_style'  => 'getwid-blocks-editor',
                'render_callback' => [ $this, 'render_block' ]
            )
        );
    }

    public function block_editor_styles($styles) {
        wp_register_style(
            'animate',
            getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
            [],
            '3.7.0'
        );

        if ( ! in_array( 'animate', $styles ) ) {
            array_push( $styles, 'animate' );
        }

        return $styles;
    }

    private function block_frontend_assets() {
        if ( is_admin() ) {
            return;
        }
    
        if ( ! wp_style_is( 'animate', 'enqueued' ) ) {
            wp_enqueue_style(
                'animate',
                getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
                [],
                '3.7.0'
            );
        }
    }

    public function render_block( $attributes, $content ) {
        $this->block_frontend_assets();
        return $content;
    }    
}

new \Getwid\Blocks\IconBox();