<?php

namespace Getwid\Blocks;

class Counter {

    private $blockName = 'getwid/counter';

    public function __construct() {

        add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );

        register_block_type(
            'getwid/counter',
            array(
                'render_callback' => [ $this, 'render_block' ]
            )
		);
		
		//Register JS/CSS assets
		wp_register_script(
			'countup',
			getwid_get_plugin_url( 'vendors/countup.js/dist/countUp.min.js' ),
			[],
			'2.0.4',
			true
		);		

		wp_register_script(
			'waypoints',
			getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
			[ 'jquery' ],
			'4.0.1',
			true
		);		
    }

    public function block_editor_scripts( $scripts ) {

		//countUp.min.js
		if ( ! in_array( 'countup', $scripts ) ) {
            array_push( $scripts, 'countup' );
        }

        return $scripts;
    }

    private function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		//jquery.waypoints.min.js
		if ( ! wp_script_is( 'waypoints', 'enqueued' ) ) {
			wp_enqueue_script('waypoints');
		}

		//countUp.min.js
		if ( ! wp_script_is( 'countup', 'enqueued' ) ) {
			wp_enqueue_script('countup');
		}
    }

    public function render_block( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }    
}

new \Getwid\Blocks\Counter();