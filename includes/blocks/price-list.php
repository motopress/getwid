<?php

namespace Getwid\Blocks;

class PriceList extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/price-list';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/price-list'
		);

	}

	public function getLabel() {
		return __('Price List', 'getwid');
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\PriceList()
);
