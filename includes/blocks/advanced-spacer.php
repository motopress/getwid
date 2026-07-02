<?php

namespace Getwid\Blocks\New;

class AdvancedSpacer extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/advanced-spacer' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/advanced-spacer' )
		);
	}

	public function get_label() {
		return __( 'Advanced Spacer', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new AdvancedSpacer()
);
