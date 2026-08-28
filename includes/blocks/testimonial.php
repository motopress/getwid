<?php

namespace Getwid\Blocks;

class Testimonial extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/testimonial' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/testimonial' )
		);
	}

	public function get_label() {
		return __( 'Testimonial', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new Testimonial()
);
