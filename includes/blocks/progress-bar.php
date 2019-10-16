<?php

namespace Getwid\Blocks;

class ProgressBar {

    private $blockName = 'getwid/progress-bar';

    public function __construct() {

        register_block_type(
            'getwid/progress-bar',
            array(
                'render_callback' => [ $this, 'render_block' ]
            )
        );

        //Register JS/CSS assets
		wp_register_script(
			'waypoints',
			getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
			[ 'jquery' ],
			'4.0.1',
			true
		);
    }

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
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

new \Getwid\Blocks\ProgressBar();