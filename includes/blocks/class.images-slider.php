<?php

namespace Getwid\Blocks;

class ImageSlider {

    private $blockName = 'getwid/images-slider';

    public function __construct() {

        add_action( 'enqueue_block_editor_assets', [ $this, 'getwid_block_load_dependency'], 20 );

        register_block_type(
            $this->blockName,
            array(
                'editor_script' => 'getwid-blocks-editor-js',
                'editor_style'  => 'getwid-blocks-editor',
                'render_callback' => [ $this, 'getwid_render_block' ]
            )
        );
    }

    public function getwid_block_load_dependency() {
        add_filter( 'getwid/editor_blocks_js/load_scripts', [ $this, 'getwid_block_editor_scripts'] );
        add_filter( 'getwid/editor_blocks_css/load_styles', [ $this, 'getwid_block_editor_styles' ] );
    }

    public function getwid_block_editor_styles( $styles = [] ) {
        wp_register_style(
			'slick',
			getwid_get_plugin_url( 'vendors/slick/slick/slick.min.css' ),
			[],
			'1.9.0'
		);

		wp_register_style(
			'slick-theme',
			getwid_get_plugin_url( 'vendors/slick/slick/slick-theme.min.css' ),
			[],
			'1.9.0'
        );

        if ( ! in_array( 'slick', $styles ) ) {
            array_push( $styles, 'slick' );
        }

        if ( ! in_array( 'slick-theme', $styles ) ) {
            array_push( $styles, 'slick-theme' );
        }

        return $styles;
    }

    public function getwid_block_editor_scripts( $scripts = [] ) {

        wp_register_script(
            'slick',
            getwid_get_plugin_url( 'vendors/slick/slick/slick.min.js' ),
            [ 'jquery' ],
            '1.9.0',
            true
        );

        if ( ! in_array( 'slick', $scripts ) ) {
            array_push( $scripts, 'slick' );
        }

        return $scripts;
    }

    private function getwid_block_frontend_assets() {
        if ( is_admin() ) {
            return;
        }

        if ( ! wp_script_is( 'slick', 'enqueued' ) ) {
            wp_enqueue_script(
                'slick',
                getwid_get_plugin_url( 'vendors/slick/slick/slick.min.js' ),
                [ 'jquery' ],
                '1.9.0',
                true
            );
        }

        if ( ! wp_style_is( 'slick', 'enqueued' ) ) {
            wp_enqueue_style(
                'slick',
                getwid_get_plugin_url( 'vendors/slick/slick/slick.min.css' ),
                [],
                '1.9.0'
            );
        }

        if ( ! wp_style_is( 'slick-theme', 'enqueued' ) ) {
            wp_enqueue_style(
                'slick-theme',
                getwid_get_plugin_url( 'vendors/slick/slick/slick-theme.min.css' ),
                [],
                '1.9.0'
            );
        }
    }

    public function getwid_render_block( $attributes, $content ) {
        $this->getwid_block_frontend_assets();
        return $content;
    }    
}

new \Getwid\Blocks\ImageSlider();