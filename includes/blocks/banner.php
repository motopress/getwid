<?php

namespace Getwid\Blocks;

class Banner extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/banner' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/banner' )
		);
	}

	public function get_label() {
		return __( 'Banner', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new Banner()
);
