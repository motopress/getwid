<?php

namespace Getwid\Blocks;

class SocialLinks extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/social-links' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/social-links' ),
			array(
				'viewStyle' => getwid()->fontIconsManager()->enqueueFonts( array() ),
			)
		);

		if ( $this->is_enabled() ) {
			add_filter( 'getwid/blocks_style_css/dependencies', array( $this, 'block_frontend_styles' ) );
		}
	}

	public function get_label() {
		return __( 'Social Links', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new SocialLinks()
);
