<?php

namespace Getwid\Blocks;

class TableOfContents extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/table-of-contents';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/table-of-contents'
		);

	}

	public function getLabel() {
		return __('Table of Contents', 'getwid');
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\TableOfContents()
);