<?php

namespace Getwid\Blocks;

class ButtonGroup extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/button-group';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			self::$blockName
		);

	}

	public function getLabel() {
		return __('Button Group', 'getwid');
	}
}

\Getwid\BlocksManager::getInstance()->addBlock(
	new \Getwid\Blocks\ButtonGroup()
);
