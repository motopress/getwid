<?php

namespace Getwid\Blocks\New;

class AdvancedHeading extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/advanced-heading' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/advanced-heading' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Advanced Heading', 'getwid' );
	}

	public function render_callback( $attributes, $content ) {

		if (
			isset( $attributes['fontWeight'] ) &&
			( 'regular' === $attributes['fontWeight'] || 'normal' === $attributes['fontWeight'] )
		) {
			$attributes['fontWeight'] = '400';
		}

		if ( $this->should_load_google_font( $attributes ) ) {
			$font_family        = $attributes['fontFamily'];
			$font_family_handle = strtolower( preg_replace( '/\s+/', '_', $font_family ) );
			$font_weight        = '';
			$font_weight_handle = '';
			$font_weight_part   = '';

			if ( isset( $attributes['fontWeight'] ) && '400' !== $attributes['fontWeight'] ) {
				$font_weight        = $attributes['fontWeight'];
				$font_weight_handle = '_' . $font_weight;
				$font_weight_part   = ':' . $font_weight;
			}

			wp_enqueue_style(
				'google-font-' . esc_attr( $font_family_handle ) . esc_attr( $font_weight_handle ),
				'https://fonts.googleapis.com/css?family=' . esc_attr( $font_family ) . esc_attr( $font_weight_part ),
				null,
				getwid()->settings()->getVersion()
			);
		}

		// $this->block_frontend_assets();

		return $content;
	}

	private function block_frontend_assets() {

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
	}

	private function should_load_google_font( $attributes ) {

		$should_load = false;

		if ( isset( $attributes['fontFamily'] ) && ! empty( $attributes['fontFamily'] ) ) {
			$should_load = true;
		}

		if (
			$should_load &&
			isset( $attributes['fontGroupID'] ) &&
			'google-fonts' !== $attributes['fontGroupID']
		) {
			$should_load = false;
		}

		return $should_load;
	}
}

getwid()->blocksManager()->addBlock(
	new AdvancedHeading()
);
