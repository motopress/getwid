<?php

namespace Getwid\Blocks\New;

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
				'render_callback' => array( $this, 'render_callback' ),
			)
		);

		if ( $this->is_enabled() ) {
			add_filter( 'getwid/blocks_style_css/dependencies', array( $this, 'block_frontend_styles' ) );
		}
	}

	public function get_label() {
		return __( 'Icon Box', 'getwid' );
	}

	public function block_frontend_styles( $styles ) {

		$styles = getwid()->fontIconsManager()->enqueueFonts( $styles );

		if ( is_admin() && ! in_array( 'animate', $styles, true ) ) {
			$styles[] = 'animate';
		}

		return $styles;
	}

	public function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		if ( ! wp_style_is( 'animate', 'enqueued' ) ) {
			wp_enqueue_style( 'animate' );
		}

		if ( false === getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		$deps = array( 'animate' );

		add_filter(
			'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );

		getwid()->fontIconsManager()->enqueueFonts( $deps );
	}

	public function render_callback( $attributes, $content ) {

		$this->block_frontend_assets();

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new IconBox()
);
