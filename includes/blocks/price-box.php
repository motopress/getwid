<?php

namespace Getwid\Blocks;

class PriceBox extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/price-box' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/price-box' )
		);
	}

	public function get_label() {
		return __( 'Price Box', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new PriceBox()
);
