<?php

namespace Getwid\Blocks;

class AdvancedSpacer extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/advanced-spacer';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			self::$blockName
		);

	}

	public function getLabel() {
		return __('Advanced Spacer', 'getwid');
	}
}

\Getwid\BlocksManager::getInstance()->addBlock(
	new \Getwid\Blocks\AdvancedSpacer()
);
