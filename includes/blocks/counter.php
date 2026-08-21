<?php

namespace Getwid\Blocks;

class Counter extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/counter' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/counter' )
		);
	}

	public function get_label() {
		return __( 'Counter', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new Counter()
);
