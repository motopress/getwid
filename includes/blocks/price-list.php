<?php

namespace Getwid\Blocks;

class PriceList extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/price-list' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/price-list' )
		);
	}

	public function get_label() {
		return __( 'Price List', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new PriceList()
);
