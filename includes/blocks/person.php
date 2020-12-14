<?php

namespace Getwid\Blocks;

class Person extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/person';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/person'
		);

	}

	public function getLabel() {
		return __('Person', 'getwid');
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\Person()
);
