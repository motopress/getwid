<?php

namespace Getwid\Blocks;

class TemplateLibrary extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/template-library';

    public function __construct() {

        parent::__construct( self::$blockName );

		register_block_type(
			'getwid/template-library'
		);
	}

	public function getLabel() {
		return __('Template Library', 'getwid');
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\TemplateLibrary()
);
