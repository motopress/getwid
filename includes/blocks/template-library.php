<?php

namespace Getwid\Blocks;

class TemplateLibrary extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/template-library' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/template-library' )
		);
	}

	public function get_label() {
		return __( 'Template Library', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new TemplateLibrary()
);
