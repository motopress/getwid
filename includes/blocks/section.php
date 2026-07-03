<?php

namespace Getwid\Blocks;

class Section extends AbstractBlock {

	private $assets_already_enqueued = false;

	public function __construct() {

		parent::__construct( 'getwid/section' );

		wp_register_script(
			'wow',
			getwid_get_plugin_url( 'vendors/wow.js/dist/wow.min.js' ),
			array( 'jquery' ),
			'1.2.1',
			true
		);

		wp_register_script(
			'slick',
			getwid_get_plugin_url( 'vendors/slick/slick/slick.min.js' ),
			array( 'jquery' ),
			'1.9.0',
			true
		);

		wp_register_style(
			'animate',
			getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
			array(),
			'3.7.0'
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
			getwid_get_plugin_path( 'assets/blocks/section' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);

		if ( $this->is_enabled() ) {
			add_filter( 'getwid/editor_blocks_js/dependencies', array( $this, 'block_editor_scripts' ) );
			add_filter( 'getwid/blocks_style_css/dependencies', array( $this, 'block_frontend_styles' ) );
		}
	}

	public function get_label() {
		return __( 'Section', 'getwid' );
	}

	public function block_frontend_styles( $styles ) {

		$styles = getwid()->fontIconsManager()->enqueueFonts( $styles );

		if ( is_admin() && ! in_array( 'animate', $styles, true ) ) {
			$styles[] = 'animate';
		}

		if ( ! in_array( 'slick', $styles, true ) ) {
			$styles[] = 'slick';
		}

		if ( ! in_array( 'slick-theme', $styles, true ) ) {
			$styles[] = 'slick-theme';
		}

		return $styles;
	}

	public function block_editor_scripts( $scripts ) {

		if ( ! in_array( 'slick', $scripts, true ) ) {
			$scripts[] = 'slick';
		}

		return $scripts;
	}

	public function block_frontend_assets( $attributes = array(), $content = '' ) {

		if ( is_admin() ) {
			return;
		}

		$has_background_slider = false !== strpos( $content, 'wp-block-getwid-section__background-slider-item' );

		if ( ! empty( $attributes['entranceAnimation'] ) ) {
			wp_enqueue_script( 'wow' );
			wp_enqueue_style( 'animate' );
		}

		if ( $has_background_slider ) {
			wp_enqueue_script( 'slick' );
			wp_enqueue_script( 'imagesloaded' );
		}

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

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );

		if ( ! $this->assets_already_enqueued ) {
			$inline_script  = 'var Getwid = Getwid || {};';
			$inline_script .= 'Getwid["isRTL"] = ' . wp_json_encode( is_rtl() ) . ';';

			wp_add_inline_script(
				'getwid-section-view-script',
				$inline_script,
				'before'
			);
		}

		$this->assets_already_enqueued = true;
	}

	public function render_callback( $attributes, $content ) {

		$this->block_frontend_assets( $attributes, $content );

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new Section()
);
