<?php

namespace Getwid\Blocks\New;

class Testimonial extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/testimonial' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/testimonial' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Testimonial', 'getwid' );
	}

	public function render_callback( $attributes, $content ) {
		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new Testimonial()
);
