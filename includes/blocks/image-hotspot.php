<?php

namespace Getwid\Blocks;

class ImageHotspot extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/image-hotspot' );

		wp_register_script(
			'popper',
			getwid_get_plugin_url( 'vendors/tippy.js/popper.min.js' ),
			array( 'jquery' ),
			'2.4.0',
			true
		);

		wp_register_script(
			'tippy',
			getwid_get_plugin_url( 'vendors/tippy.js/tippy-bundle.umd.min.js' ),
			array( 'jquery', 'popper' ),
			'6.2.3',
			true
		);

		wp_register_script(
			'waypoints',
			getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
			array( 'jquery' ),
			'4.0.1',
			true
		);

		wp_register_script(
			'unescape',
			getwid_get_plugin_url( 'vendors/lodash.unescape/unescape.min.js' ),
			array(),
			'4.0.1',
			true
		);

		wp_register_style(
			'tippy-themes',
			getwid_get_plugin_url( 'vendors/tippy.js/themes.css' ),
			array(),
			'6.2.3'
		);

		wp_register_style(
			'tippy-animation',
			getwid_get_plugin_url( 'vendors/tippy.js/animations.css' ),
			array(),
			'6.2.3'
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/image-hotspot' )
		);

		add_action( 'enqueue_block_assets', array( $this, 'add_block_assets' ) );
	}

	public function get_label() {
		return __( 'Image Hotspot', 'getwid' );
	}

	public function add_block_assets() {
		if ( ! is_admin() ) {
			return;
		}

		wp_enqueue_script( 'tippy' );
	}
}

getwid()->blocksManager()->addBlock(
	new ImageHotspot()
);
