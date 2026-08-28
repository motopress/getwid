<?php

namespace Getwid\Blocks;

class Table extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/table' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/table' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Table', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new Table()
);
