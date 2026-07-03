<?php

namespace Getwid\Blocks;

class Counter extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/counter' );

		$this->register_vendor_scripts();

		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/counter' )
		);
	}

	public function get_label() {
		return __( 'Counter', 'getwid' );
	}

	private function register_vendor_scripts() {

		wp_register_script(
			'countup',
			getwid_get_plugin_url( 'vendors/countup.js/dist/countUp.min.js' ),
			array(),
			'2.0.4',
			true
		);

		wp_register_script(
			'waypoints',
			getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
			array( 'jquery' ),
			'4.0.1',
			true
		);
	}

	public function enqueue_editor_assets() {

		wp_enqueue_script( 'countup' );
	}
}

getwid()->blocksManager()->addBlock(
	new Counter()
);
