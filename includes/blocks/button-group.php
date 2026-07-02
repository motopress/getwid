<?php

namespace Getwid\Blocks\New;

class ButtonGroup extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/button-group' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/button-group' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Button Group', 'getwid' );
	}

	public function render_callback( $attributes, $content ) {

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new ButtonGroup()
);
