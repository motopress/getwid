<?php

namespace Getwid\Blocks;

class ContentSlider extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/content-slider' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/content-slider/content-slider' )
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/content-slider/content-slider-slide' )
		);
	}

	public function get_label() {
		return __( 'Content Slider', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new ContentSlider()
);
