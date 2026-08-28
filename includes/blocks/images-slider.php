<?php

namespace Getwid\Blocks;

class ImageSlider extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/images-slider' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/images-slider' )
		);
	}

	public function get_label() {
		return __( 'Image Slider', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new ImageSlider()
);
