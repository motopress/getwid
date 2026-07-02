<?php

namespace Getwid\Blocks\New;

class CircleProgressBar extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/circle-progress-bar' );

		wp_register_script(
			'waypoints',
			getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
			array( 'jquery' ),
			'4.0.1',
			true
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/circle-progress-bar' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Circular Progress Bar', 'getwid' );
	}

	public function render_callback( $attributes, $content ) {

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new CircleProgressBar()
);
