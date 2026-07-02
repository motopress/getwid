<?php

namespace Getwid\Blocks\New;

class Banner extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/banner' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/banner' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Banner', 'getwid' );
	}

	public function render_callback( $attributes, $content ) {

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new Banner()
);
