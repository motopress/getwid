<?php

namespace Getwid\Blocks;

class ImagesStack extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/images-stack' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/images-stack' )
		);
	}

	public function get_label() {
		return __( 'Image Stack Gallery', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new ImagesStack()
);
