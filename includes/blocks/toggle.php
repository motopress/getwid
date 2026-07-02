<?php

namespace Getwid\Blocks\New;

class Toggle extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/toggle' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/toggle' ),
			array(
				'viewStyle' => getwid()->fontIconsManager()->enqueueFonts( array() ),
			)
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/toggle-item' )
		);
	}

	public function get_label() {
		return __( 'Toggle', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new Toggle()
);
