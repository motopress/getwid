<?php

namespace Getwid\Blocks;

class ContentTimeline extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/content-timeline';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/content-timeline',
			 array(
                'render_callback' => [ $this, 'render_callback' ]
            )
		);

	}

	public function getLabel() {
		return __('Content Timeline', 'getwid');
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

		wp_enqueue_style(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/content-timeline/style.css' ),
			[],
			getwid()->settings()->getVersion()
		);

		wp_enqueue_script(
            self::$blockName,
            getwid_get_plugin_url( 'assets/blocks/content-timeline/frontend.js' ),
            [ 'jquery' ],
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
	new \Getwid\Blocks\ContentTimeline()
);
