<?php

namespace Getwid\Blocks\New;

class ProgressBar extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/progress-bar' );

		wp_register_script(
			'waypoints',
			getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
			array( 'jquery' ),
			'4.0.1',
			true
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/progress-bar' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Progress Bar', 'getwid' );
	}

	public function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		wp_enqueue_script( 'waypoints' );
	}

	public function render_callback( $attributes, $content ) {

		$this->block_frontend_assets();

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new ProgressBar()
);
