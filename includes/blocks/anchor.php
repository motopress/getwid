<?php

namespace Getwid\Blocks;

class Anchor extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/anchor';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/anchor'
		);

	}

	public function getLabel() {
		return __('Anchor', 'getwid');
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\Anchor()
);
