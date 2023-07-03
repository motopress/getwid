<?php

namespace Getwid\Blocks;

class AI extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/ai';

    public function __construct() {

        parent::__construct( self::$blockName );

		register_block_type(
			'getwid/ai'
		);
	}

	public function getLabel() {
		return __('AI Assistant (Beta)', 'getwid');
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\AI()
);
