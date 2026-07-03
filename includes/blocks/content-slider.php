<?php

namespace Getwid\Blocks;

class ContentSlider extends AbstractBlock {

	private $assets_already_enqueued = false;

	public function __construct() {

		parent::__construct( 'getwid/content-slider' );

		wp_register_script(
			'slick',
			getwid_get_plugin_url( 'vendors/slick/slick/slick.min.js' ),
			array( 'jquery' ),
			'1.9.0',
			true
		);

		wp_register_style(
			'slick',
			getwid_get_plugin_url( 'vendors/slick/slick/slick.min.css' ),
			array(),
			'1.9.0'
		);

		wp_register_style(
			'slick-theme',
			getwid_get_plugin_url( 'vendors/slick/slick/slick-theme.min.css' ),
			array(),
			'1.9.0'
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/content-slider/content-slider' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/content-slider/content-slider-slide' )
		);
	}

	public function get_label() {
		return __( 'Content Slider', 'getwid' );
	}

	public function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		wp_enqueue_script( 'slick' );

		if ( false === getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		add_filter(
			'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = 'slick';
				$assets[] = 'slick-theme';
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		wp_enqueue_style( 'slick' );
		wp_enqueue_style( 'slick-theme' );

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );

		if ( ! $this->assets_already_enqueued ) {
			$inline_script  = 'var Getwid = Getwid || {};';
			$inline_script .= 'Getwid["isRTL"] = ' . wp_json_encode( is_rtl() ) . ';';

			wp_add_inline_script(
				'getwid-content-slider-view-script',
				$inline_script,
				'before'
			);
		}

		$this->assets_already_enqueued = true;
	}

	public function render_callback( $attributes, $content ) {

		$this->block_frontend_assets();

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new ContentSlider()
);
