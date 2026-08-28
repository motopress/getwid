<?php

namespace Getwid\Blocks;

class Icon extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/icon' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/icon' )
		);
	}

	public function get_label() {
		return __( 'Icon', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new Icon()
);
