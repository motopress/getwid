<?php

namespace Getwid\Blocks;

class AdvancedSpacer extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/advanced-spacer';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/advanced-spacer'
		);

	}

	public function getLabel() {
		return __('Advanced Spacer', 'getwid');
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\AdvancedSpacer()
);
