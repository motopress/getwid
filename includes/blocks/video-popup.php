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

		getwid_log( self::$blockName . '::hasBlock', $this->hasBlock() );

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
    }

    public function render_callback( $attributes, $content ) {

		$this->block_frontend_assets();

        return $content;
    }
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\VideoPopup()
);
