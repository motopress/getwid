<?php

namespace Getwid\Blocks;

class IconBox extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/icon-box' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/icon-box' )
		);
	}

	public function get_label() {
		return __( 'Icon Box', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new IconBox()
);
