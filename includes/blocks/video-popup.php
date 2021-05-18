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
				'magnific-popup',
				getwid_get_plugin_url( 'vendors/magnific-popup/jquery.magnific-popup.min.js' ),
				[ 'jquery' ],
				'1.1.0',
				true
			);

			wp_register_style(
				'magnific-popup',
				getwid_get_plugin_url( 'vendors/magnific-popup/magnific-popup.min.css' ),
				[],
				'1.1.0'
			);
		}
    }

	public function getLabel() {
		return __('Video Popup', 'getwid');
	}

    public function block_frontend_styles($styles) {

		//fontawesome
		$styles = getwid()->fontIconsManager()->enqueueFonts( $styles );

        //magnific-popup.min.css
		if ( ! is_admin() && ! in_array( 'magnific-popup', $styles ) ) {
            array_push( $styles, 'magnific-popup' );
        }

        return $styles;
    }

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }

        //jquery.magnific-popup.min.js
		if ( ! wp_script_is( 'magnific-popup', 'enqueued' ) ) {
            wp_enqueue_script('magnific-popup');
        }

		if ( FALSE == getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		$deps = [
			'magnific-popup'
		];

		add_filter( 'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = 'magnific-popup';
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );

		//fontawesome
		$deps = getwid()->fontIconsManager()->enqueueFonts( $deps );

		wp_enqueue_style(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/video-popup/style.css' ),
			$deps,
			getwid()->settings()->getVersion()
		);

		wp_enqueue_script(
            self::$blockName,
            getwid_get_plugin_url( 'assets/blocks/video-popup/frontend.js' ),
            [ 'jquery', 'magnific-popup' ],
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
