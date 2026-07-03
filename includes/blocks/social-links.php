<?php

namespace Getwid\Blocks;

class SocialLinks extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/social-links' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/social-links' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);

		if ( $this->is_enabled() ) {
			add_filter( 'getwid/blocks_style_css/dependencies', array( $this, 'block_frontend_styles' ) );
		}
	}

	public function get_label() {
		return __( 'Social Links', 'getwid' );
	}

	public function block_frontend_styles( $styles ) {

		return getwid()->fontIconsManager()->enqueueFonts( $styles );
	}

	public function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		if ( false === getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		add_filter(
			'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );

		getwid()->fontIconsManager()->enqueueFonts( array() );
	}

	public function render_callback( $attributes, $content ) {

		$this->block_frontend_assets();

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new SocialLinks()
);
