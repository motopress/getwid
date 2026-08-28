<?php

namespace Getwid\Blocks;

class ImageHotspot extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/image-hotspot' );

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
