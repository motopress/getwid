<?php

namespace Getwid\Blocks;

class Person extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/person' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/person' ),
		);
	}

	public function get_label() {
		return __( 'Person', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new Person()
);
