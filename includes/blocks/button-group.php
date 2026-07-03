<?php

namespace Getwid\Blocks;

class ButtonGroup extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/button-group' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/button-group' ),
		);
	}

	public function get_label() {
		return __( 'Button Group', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new ButtonGroup()
);
