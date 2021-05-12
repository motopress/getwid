<?php

namespace Getwid\Blocks;

class PriceBox extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/price-box';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/price-box',
			array(
				'render_callback' => [ $this, 'render_callback' ]
			)
		);

	}

	public function getLabel() {
		return __('Price Box', 'getwid');
	}

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }

		if ( FALSE == getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		wp_enqueue_style(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/price-box/style.css' ),
			[],
			getwid()->settings()->getVersion()
		);
    }

	public function render_callback( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }

}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\PriceBox()
);
