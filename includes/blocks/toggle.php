<?php

namespace Getwid\Blocks;

class Toggle extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/toggle';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            self::$blockName
        );
    }

	public function getLabel() {
		return __('Toggle', 'getwid');
	}
}

\Getwid\BlocksManager::getInstance()->addBlock(
	new \Getwid\Blocks\Toggle()
);
