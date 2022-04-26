<?php

namespace Getwid\Blocks;

class ContentSlider extends AbstractBlock {

	protected static $blockName = 'getwid/content-slider';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/content-slider',
			array(
				'render_callback' => [ $this, 'render_callback' ]
			)
		);

		if ( $this->isEnabled() ) {

			add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );
			add_filter( 'getwid/blocks_style_css/dependencies', [ $this, 'block_frontend_styles' ] );

			//Register JS/CSS assets
			wp_register_script(
				'slick',
				getwid_get_plugin_url( 'vendors/slick/slick/slick.min.js' ),
				[ 'jquery' ],
				'1.9.0',
				true
			);

			wp_register_style(
				'slick',
				getwid_get_plugin_url( 'vendors/slick/slick/slick.min.css' ),
				[],
				'1.9.0'
			);

			wp_register_style(
				'slick-theme',
				getwid_get_plugin_url( 'vendors/slick/slick/slick-theme.min.css' ),
				[],
				'1.9.0'
			);
		}
	}

	public function getLabel() {
		return __('Content Slider', 'getwid');
	}

	public function block_frontend_styles($styles) {

		//slick.min.css
		if ( ! in_array( 'slick', $styles ) ) {
			array_push( $styles, 'slick' );
		}

		//slick-theme.min.css
		if ( ! in_array( 'slick-theme', $styles ) ) {
			array_push( $styles, 'slick-theme' );
		}

		return $styles;
	}

	public function block_editor_scripts($scripts) {

		//slick.min.js
		if ( ! in_array( 'slick', $scripts ) ) {
			array_push( $scripts, 'slick' );
		}

		return $scripts;
	}

	private function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		//slick.min.js
		if ( ! wp_script_is( 'slick', 'enqueued' ) ) {
			wp_enqueue_script('slick');
		}

		if ( FALSE == getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		add_filter( 'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = 'slick';
				$assets[] = 'slick-theme';
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );

		wp_enqueue_script(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/content-slider/frontend.js' ),
			[ 'jquery', 'slick' ],
			getwid()->settings()->getVersion(),
			true
		);

	}

	public function render_callback( $attributes, $content ) {

		$this->block_frontend_assets();

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new ContentSlider()
);
