<?php

namespace Getwid\Blocks\New;

class Accordion extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/accordion' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/accordion' ),
			array(
				'viewStyle' => getwid()->fontIconsManager()->enqueueFonts( array() ),
			)
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/accordion-item' )
		);
	}

	public function getLabel() {
		return __( 'Accordion', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new Accordion()
);
