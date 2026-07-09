<?php

namespace Getwid\Blocks;

class IconBox extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/icon-box' );

		wp_register_style(
			'animate',
			getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
			array(),
			'3.7.0'
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/icon-box' ),
			array(
				'viewStyle' => getwid()->fontIconsManager()->enqueueFonts( array() ),
			)
		);
	}

	public function get_label() {
		return __( 'Icon Box', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new IconBox()
);
