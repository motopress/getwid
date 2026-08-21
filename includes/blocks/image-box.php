<?php

namespace Getwid\Blocks;

class ImageBox extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/image-box' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/image-box' )
		);
	}

	public function get_label() {
		return __( 'Image Box', 'getwid' );
	}
}


getwid()->blocksManager()->addBlock(
	new ImageBox()
);
