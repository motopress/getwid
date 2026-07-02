<?php

namespace Getwid\Blocks\New;

class Anchor extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/anchor' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/anchor' )
		);
	}

	public function get_label() {
		return __( 'Anchor', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new Anchor()
);
