<?php

namespace Getwid\Blocks;

class Table extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/table';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            'getwid/table'
        );
    }

	public function getLabel() {
		return __( 'Table', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\Table()
);