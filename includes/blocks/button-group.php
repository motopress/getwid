<?php

namespace Getwid\Blocks;

class ButtonGroup extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/button-group';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/button-group'
		);

	}

	public function getLabel() {
		return __('Button Group', 'getwid');
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\ButtonGroup()
);
