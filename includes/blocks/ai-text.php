<?php

namespace Getwid\Blocks;

class AIText extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/ai-text';

    public function __construct() {

        parent::__construct( self::$blockName );

		register_block_type(
			'getwid/ai-text'
		);
	}

	public function getLabel() {
		return __('AI Assistant', 'getwid');
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\AIText()
);
