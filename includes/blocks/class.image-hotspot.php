<?php

namespace Getwid\Blocks;

class ImageHotspot {

    private $blockName = 'getwid/image-hotspot';

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
			'tippy-themes',
			getwid_get_plugin_url( 'vendors/tippy.js/themes.css' ),
			[],
			'4.3.5'
		);

        if ( ! in_array( 'tippy-themes', $styles ) ) {
            array_push( $styles, 'tippy-themes' );
        }

        return $styles;
    }

    public function getwid_block_editor_scripts( $scripts = [] ) {
		
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

    private function getwid_block_frontend_assets() {
		if ( is_admin() ) {
			return;
		}
	
		if ( ! wp_script_is( 'popper', 'enqueued' ) ) {
			wp_enqueue_script(
				'popper',
				getwid_get_plugin_url( 'vendors/tippy.js/popper.min.js' ),
				[ 'jquery' ],
				'1.15.0',
				true
			);
		}
	
		if ( ! wp_script_is( 'tippy', 'enqueued' ) ) {
			wp_enqueue_script(
				'tippy',
				getwid_get_plugin_url( 'vendors/tippy.js/index.all.min.js' ),
				[ 'jquery', 'popper' ],
				'4.3.5',
				true
			);
		}
	
		if ( ! wp_script_is( 'waypoints', 'enqueued' ) ) {
			wp_enqueue_script(
				'waypoints',
				getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
				[ 'jquery' ],
				'4.0.1',
				true
			);
		}    
	
		if ( ! wp_style_is( 'tippy-themes', 'enqueued' ) ) {
			wp_enqueue_style(
				'tippy-themes',
				getwid_get_plugin_url( 'vendors/tippy.js/themes.css' ),
				[],
				'4.3.5'
			);
		}  
    }

    public function getwid_render_block( $attributes, $content ) {
        $this->getwid_block_frontend_assets();
        return $content;
    }    
}

new \Getwid\Blocks\ImageHotspot();




























<?php

//Enqueue frontend-only block JS and CSS
function assets_getwid_image_hotspot(){
    if ( is_admin() ) {
        return;
    }

    if ( ! wp_script_is( 'popper', 'enqueued' ) ) {
		wp_enqueue_script(
			'popper',
			getwid_get_plugin_url( 'vendors/tippy.js/popper.min.js' ),
			[ 'jquery' ],
			'1.15.0',
			true
		);
    }

    if ( ! wp_script_is( 'tippy', 'enqueued' ) ) {
		wp_enqueue_script(
			'tippy',
			getwid_get_plugin_url( 'vendors/tippy.js/index.all.min.js' ),
			[ 'jquery', 'popper' ],
			'4.3.5',
			true
		);
    }

    if ( ! wp_script_is( 'waypoints', 'enqueued' ) ) {
		wp_enqueue_script(
			'waypoints',
			getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
			[ 'jquery' ],
			'4.0.1',
			true
		);
    }    

    if ( ! wp_style_is( 'tippy-themes', 'enqueued' ) ) {
		wp_enqueue_style(
			'tippy-themes',
			getwid_get_plugin_url( 'vendors/tippy.js/themes.css' ),
			[],
			'4.3.5'
		);
    }    
}

function render_getwid_image_hotspot( $attributes, $content ) {

    assets_getwid_image_hotspot();

    return $content;
}

register_block_type(
    'getwid/image-hotspot',
    array(
        'render_callback' => 'render_getwid_image_hotspot',
    )
);