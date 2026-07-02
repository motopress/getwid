<?php

namespace Getwid\Blocks\New;

class VideoPopup extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/video-popup' );

		if ( $this->is_enabled() ) {
			add_filter( 'getwid/blocks_style_css/dependencies', array( $this, 'block_frontend_styles' ) );

			wp_register_script(
				'mp-fancybox',
				getwid_get_plugin_url( 'vendors/mp-fancybox/jquery.fancybox.min.js' ),
				array( 'jquery' ),
				'3.5.7-mp.1',
				true
			);

			wp_register_style(
				'mp-fancybox',
				getwid_get_plugin_url( 'vendors/mp-fancybox/jquery.fancybox.min.css' ),
				array(),
				'3.5.7-mp.1'
			);
		}

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/video-popup' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Video Popup', 'getwid' );
	}

	public function block_frontend_styles( $styles ) {

		$styles = getwid()->fontIconsManager()->enqueueFonts( $styles );

		if ( ! is_admin() && ! in_array( 'mp-fancybox', $styles, true ) ) {
			$styles[] = 'mp-fancybox';
		}

		return $styles;
	}

	public function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		if ( ! wp_script_is( 'mp-fancybox', 'enqueued' ) ) {
			wp_enqueue_script( 'mp-fancybox' );
		}

		if ( false === getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		add_filter(
			'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = 'mp-fancybox';
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );
	}

	public function render_callback( $attributes, $content ) {

		$this->block_frontend_assets();

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new VideoPopup()
);
