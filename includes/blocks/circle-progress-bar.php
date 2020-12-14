<?php

namespace Getwid\Blocks;

class CircleProgressBar extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/circle-progress-bar';

    public function __construct() {

        parent::__construct( self::$blockName );

		register_block_type(
            'getwid/circle-progress-bar',
            array(
                'render_callback' => [ $this, 'render_callback' ]
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

	public function getLabel() {
		return __('Circular Progress Bar', 'getwid');
	}

    private function block_frontend_assets( $attributes = null ) {

        if ( is_admin() ) {
            return;
        }

        //jquery.waypoints.min.js
		if ( ! wp_script_is( 'waypoints', 'enqueued' ) ) {
            wp_enqueue_script('waypoints');
        }
    }

    public function render_callback( $attributes, $content ) {

        $this->block_frontend_assets( $attributes );

        return $content;
    }
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\CircleProgressBar()
);
