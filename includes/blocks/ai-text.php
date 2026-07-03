<?php

namespace Getwid\Blocks;

class AIText extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/ai-text' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/ai-text' )
		);
	}

	public function get_label() {
		return __( 'AI Assistant', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new AIText()
);
