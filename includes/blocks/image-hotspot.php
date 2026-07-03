<?php

namespace Getwid\Blocks;

class ImageHotspot extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/image-hotspot' );

		wp_register_script(
			'popper',
			getwid_get_plugin_url( 'vendors/tippy.js/popper.min.js' ),
			array( 'jquery' ),
			'2.4.0',
			true
		);

		wp_register_script(
			'tippy',
			getwid_get_plugin_url( 'vendors/tippy.js/tippy-bundle.umd.min.js' ),
			array( 'jquery', 'popper' ),
			'6.2.3',
			true
		);

		wp_register_script(
			'waypoints',
			getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
			array( 'jquery' ),
			'4.0.1',
			true
		);

		wp_register_script(
			'unescape',
			getwid_get_plugin_url( 'vendors/lodash.unescape/unescape.min.js' ),
			array(),
			'4.0.1',
			true
		);

		wp_register_style(
			'tippy-themes',
			getwid_get_plugin_url( 'vendors/tippy.js/themes.css' ),
			array(),
			'6.2.3'
		);

		wp_register_style(
			'tippy-animation',
			getwid_get_plugin_url( 'vendors/tippy.js/animations.css' ),
			array(),
			'6.2.3'
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/image-hotspot' ),
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
		return __( 'Image Hotspot', 'getwid' );
	}

	public function block_frontend_styles( $styles ) {

		$styles = getwid()->fontIconsManager()->enqueueFonts( $styles );

		if ( is_admin() && ! in_array( 'tippy-themes', $styles, true ) ) {
			$styles[] = 'tippy-themes';
		}

		if ( is_admin() && ! in_array( 'tippy-animation', $styles, true ) ) {
			$styles[] = 'tippy-animation';
		}

		return $styles;
	}

	public function block_editor_scripts( $scripts ) {

		if ( ! in_array( 'popper', $scripts, true ) ) {
			$scripts[] = 'popper';
		}

		if ( ! in_array( 'tippy', $scripts, true ) ) {
			$scripts[] = 'tippy';
		}

		return $scripts;
	}

	public function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		if ( ! wp_script_is( 'popper', 'enqueued' ) ) {
			wp_enqueue_script( 'popper' );
		}

		if ( ! wp_script_is( 'tippy', 'enqueued' ) ) {
			wp_enqueue_script( 'tippy' );
		}

		if ( ! wp_script_is( 'waypoints', 'enqueued' ) ) {
			wp_enqueue_script( 'waypoints' );
		}

		if ( ! wp_script_is( 'unescape', 'enqueued' ) ) {
			wp_enqueue_script( 'unescape' );
		}

		if ( ! wp_style_is( 'tippy-themes', 'enqueued' ) ) {
			wp_enqueue_style( 'tippy-themes' );
		}

		if ( ! wp_style_is( 'tippy-animation', 'enqueued' ) ) {
			wp_enqueue_style( 'tippy-animation' );
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

	public function render_callback( $attributes, $content ) {

		$this->block_frontend_assets();

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new ImageHotspot()
);
