<?php

namespace Getwid\Blocks;

class TemplateLibrary extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/template-library';

    public function __construct() {

        parent::__construct( self::$blockName );

		register_block_type(
			self::$blockName
		);
	}

	public function getLabel() {
		return __('Template Library', 'getwid');
	}
}

\Getwid\BlocksManager::getInstance()->addBlock(
	new \Getwid\Blocks\TemplateLibrary()
);
