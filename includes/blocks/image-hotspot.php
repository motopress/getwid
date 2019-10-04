<?php

namespace Getwid\Blocks;

class ImageHotspot {

    private $blockName = 'getwid/image-hotspot';

    public function __construct() {

        $settings = \Getwid\Settings::getInstance();

        add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );
        
        add_filter( 'getwid/editor_blocks_css/dependencies'  , [ $this, 'block_editor_styles'   ] );
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

		wp_register_script(
			'draggabilly',
			getwid_get_plugin_url( 'vendors/draggabilly/draggabilly.pkgd.min.js' ),
			[ 'jquery' ],
			'2.2.0',
			true
		);

		wp_register_script(
			'popper',
			getwid_get_plugin_url( 'vendors/tippy.js/popper.min.js' ),
			[ 'jquery' ],
			'1.15.0',
			true
		);

		wp_register_script(
			'tippy',
			getwid_get_plugin_url( 'vendors/tippy.js/index.all.min.js' ),
			[ 'jquery', 'popper' ],
			'4.3.5',
			true
		);	

		wp_register_script(
			'waypoints',
			getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
			[ 'jquery' ],
			'4.0.1',
			true
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

        wp_register_style(
			'tippy-themes',
			getwid_get_plugin_url( 'vendors/tippy.js/themes.css' ),
			[],
			'4.3.5'
		);
    }

    public function block_editor_styles($styles) {

        if ( ! in_array( 'tippy-themes', $styles ) ) {
            array_push( $styles, 'tippy-themes' );
        }

        if ( ! in_array( 'fonticonpicker-base-theme', $styles ) ) {
            array_push( $styles, 'fonticonpicker-base-theme' );
        }

        if ( ! in_array( 'fonticonpicker-react-theme', $styles ) ) {
            array_push( $styles, 'fonticonpicker-react-theme' );
        } 

        return $styles;
    }

    public function block_frontend_styles($styles) {

        if ( ! in_array( 'tippy-themes', $styles ) ) {
            array_push( $styles, 'tippy-themes' );        
        }

        return $styles;
    }  

    public function block_editor_scripts($scripts) {
		
        if ( ! in_array( 'imagesloaded', $scripts ) ) {
            array_push( $scripts, 'imagesloaded' );
		}

        if ( ! in_array( 'draggabilly', $scripts ) ) {
            array_push( $scripts, 'draggabilly' );
		}

        if ( ! in_array( 'popper', $scripts ) ) {
            array_push( $scripts, 'popper' );
		}
		
        if ( ! in_array( 'tippy', $scripts ) ) {
            array_push( $scripts, 'tippy' );
		}			

        return $scripts;
    }

    private function block_frontend_assets() {
		if ( is_admin() ) {
			return;
		}
	
        if ( ! wp_script_is( 'getwid-functions', 'enqueued' ) ) {
            wp_enqueue_script( 'getwid-functions' );
        }

		if ( ! wp_script_is( 'popper', 'enqueued' ) ) {
			wp_enqueue_script('popper');
		}
	
		if ( ! wp_script_is( 'tippy', 'enqueued' ) ) {
			wp_enqueue_script('tippy');
		}
	
		if ( ! wp_script_is( 'waypoints', 'enqueued' ) ) {
			wp_enqueue_script('waypoints');
		}     
    }

    public function render_block( $attributes, $content ) {
        $this->block_frontend_assets();
        return $content;
    }    
}

new \Getwid\Blocks\ImageHotspot();