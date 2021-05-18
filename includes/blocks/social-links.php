<?php

namespace Getwid\Blocks;

class SocialLinks extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/social-links';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            'getwid/social-links',
			array(
				'render_callback' => [ $this, 'render_callback' ]
			)
        );

		if ( $this->isEnabled() ) {

			add_filter( 'getwid/blocks_style_css/dependencies', [ $this, 'block_frontend_styles' ] );
		}
    }

	public function getLabel() {
		return __('Social Links', 'getwid');
	}

	public function block_frontend_styles($styles) {

		//fontawesome
		$styles = getwid()->fontIconsManager()->enqueueFonts( $styles );

        return $styles;
    }

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }

		if ( FALSE == getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		add_filter( 'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );

		//fontawesome
		$deps = getwid()->fontIconsManager()->enqueueFonts( [] );

		wp_enqueue_style(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/social-links/style.css' ),
			$deps,
			getwid()->settings()->getVersion()
		);
    }

	public function render_callback( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }

}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\SocialLinks()
);
