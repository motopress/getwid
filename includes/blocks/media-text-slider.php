<?php

namespace Getwid\Blocks;

class MediaTextSlider extends AbstractBlock {


	public function __construct() {

		parent::__construct( 'getwid/media-text-slider' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/media-text-slider/media-text-slider' ),
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/media-text-slider/media-text-slider-slide' )
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/media-text-slider/media-text-slider-slide-content' )
		);
	}

	public function get_label() {
		return __( 'Media & Text Slider', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new MediaTextSlider()
);
