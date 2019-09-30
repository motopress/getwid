<?php

namespace Getwid\Blocks;

class Section {

    private $blockName = 'getwid/section';

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
            'animate',
            getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
            [],
            '3.7.0'
        );

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

        if ( ! in_array( 'animate', $styles ) ) {
            array_push( $styles, 'animate' );
        }

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
            'wow',
            getwid_get_plugin_url( 'vendors/wow.js/dist/wow.min.js' ),
            [ 'jquery' ],
            '1.2.1',
            true
        );        

        if ( ! in_array( 'wow', $scripts ) ) {
            array_push( $scripts, 'wow' );
        }

        return $scripts;
    }

    private function getwid_block_frontend_assets() {
        if ( is_admin() ) {
            return;
        }
    
        if ( ! wp_script_is( 'wow', 'enqueued' ) ) {
            wp_enqueue_script(
                'wow',
                getwid_get_plugin_url( 'vendors/wow.js/dist/wow.min.js' ),
                [ 'jquery' ],
                '1.2.1',
                true
            );
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
    
        if ( ! wp_style_is( 'animate', 'enqueued' ) ) {
            wp_enqueue_style(
                'animate',
                getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
                [],
                '3.7.0'
            );
        }   
    }

    public function getwid_render_block( $attributes, $content ) {
        $this->getwid_block_frontend_assets();
        return $content;
    }    
}

new \Getwid\Blocks\Section();






































<?php

//Enqueue frontend-only block JS and CSS
function assets_getwid_section(){
    if ( is_admin() ) {
        return;
    }

    if ( ! wp_script_is( 'wow', 'enqueued' ) ) {
		wp_enqueue_script(
			'wow',
			getwid_get_plugin_url( 'vendors/wow.js/dist/wow.min.js' ),
			[ 'jquery' ],
			'1.2.1',
			true
		);
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

    if ( ! wp_style_is( 'animate', 'enqueued' ) ) {
		wp_enqueue_style(
			'animate',
			getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
			[],
			'3.7.0'
		);
    }    
}

function render_getwid_section( $attributes, $content ) {

    assets_getwid_section();

    return $content;
}

register_block_type(
    'getwid/section',
    array(
        'render_callback' => 'render_getwid_section',
    )
);