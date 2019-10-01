<?php

namespace Getwid\Blocks;

class Counter {

    private $blockName = 'getwid/counter';

    public function __construct() {

        add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );

        register_block_type(
            $this->blockName,
            array(
                'editor_script' => 'getwid-blocks-editor-js',
                'editor_style'  => 'getwid-blocks-editor',
                'render_callback' => [ $this, 'render_block' ]
            )
        );
    }

    public function block_editor_scripts( $scripts/*  = [] */ ) {
		wp_register_script(
			'countup',
			getwid_get_plugin_url( 'vendors/countup.js/dist/countUp.min.js' ),
			[],
			'2.0.4',
			true
		);		

		if ( ! in_array( 'countup', $scripts ) ) {
            array_push( $scripts, 'countup' );
        }

        return $scripts;
    }

    private function block_frontend_assets() {
		if ( is_admin() ) {
			return;
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
	
		if ( ! wp_script_is( 'countup', 'enqueued' ) ) {
			wp_enqueue_script(
				'countup',
				getwid_get_plugin_url( 'vendors/countup.js/dist/countUp.min.js' ),
				[],
				'2.0.4',
				true
			);
		}
    }

    public function render_block( $attributes, $content ) {
        $this->block_frontend_assets();
        return $content;
    }    
}

new \Getwid\Blocks\Counter();