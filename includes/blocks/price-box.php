<?php

namespace Getwid\Blocks;

class PriceBox extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/price-box';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/price-box'
		);

	}

	public function getLabel() {
		return __('Price Box', 'getwid');
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\PriceBox()
);
