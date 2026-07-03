<?php

namespace Getwid\Blocks;

class Tabs extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/tabs' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/tabs/tabs' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/tabs/tabs-item' )
		);
	}

	public function get_label() {
		return __( 'Tabs', 'getwid' );
	}

	public function render_callback( $attributes, $content ) {
		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new Tabs()
);
