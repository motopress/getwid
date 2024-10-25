<?php

namespace Getwid\Blocks;

class VideoPopup extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/video-popup';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            'getwid/video-popup',
            array(
                'render_callback' => [ $this, 'render_callback' ]
            )
        );

		if ( $this->isEnabled() ) {

			add_filter( 'getwid/blocks_style_css/dependencies', [ $this, 'block_frontend_styles' ] );

			//Register JS/CSS assets
			wp_register_script(
				'mp-fancybox',
				getwid_get_plugin_url( 'vendors/mp-fancybox/jquery.fancybox.min.js' ),
				[ 'jquery' ],
				'3.5.7-mp.1',
				true
			);

			wp_register_style(
				'mp-fancybox',
				getwid_get_plugin_url( 'vendors/mp-fancybox/jquery.fancybox.min.css' ),
				[],
				'3.5.7-mp.1'
			);
		}
    }

	public function getLabel() {
		return __('Video Popup', 'getwid');
	}

    public function block_frontend_styles($styles) {

		//fontawesome
		$styles = getwid()->fontIconsManager()->enqueueFonts( $styles );

        //jquery.fancybox.min.css
		if ( ! is_admin() && ! in_array( 'mp-fancybox', $styles ) ) {
            array_push( $styles, 'mp-fancybox' );
        }

        return $styles;
    }

    public function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }

		//jquery.fancybox.min.js
		if ( ! wp_script_is( 'mp-fancybox', 'enqueued' ) ) {
            wp_enqueue_script('mp-fancybox');
        }

		if ( FALSE == getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		$deps = [
			'mp-fancybox',
		];

		add_filter( 'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = 'mp-fancybox';
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );

		//fontawesome
		$deps = getwid()->fontIconsManager()->enqueueFonts( $deps );

		$rtl = is_rtl() ? '.rtl' : '';

		wp_enqueue_style(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/video-popup/style' . $rtl . '.css' ),
			$deps,
			getwid()->settings()->getVersion()
		);

		wp_enqueue_script(
            self::$blockName,
            getwid_get_plugin_url( 'assets/blocks/video-popup/frontend.js' ),
            [
				'jquery',
				'mp-fancybox'
			],
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
	new \Getwid\Blocks\VideoPopup()
);
