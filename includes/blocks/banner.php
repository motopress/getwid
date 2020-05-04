<?php

namespace Getwid\Blocks;

class Banner extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/banner';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            'getwid/banner'
        );

    }

	public function getLabel() {
		return __('Banner', 'getwid');
	}

}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\Banner()
);
