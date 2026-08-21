<?php

namespace Getwid\Blocks;

class ProgressBar extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/progress-bar' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/progress-bar' )
		);
	}

	public function get_label() {
		return __( 'Progress Bar', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new ProgressBar()
);
