<?php

namespace Getwid\Blocks;

class Testimonial extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/testimonial';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/testimonial',
			array(
				'render_callback' => [ $this, 'render_callback' ]
			)
		);

	}

	public function getLabel() {
		return __('Testimonial', 'getwid');
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
			getwid_get_plugin_url( 'assets/blocks/testimonial/style.css' ),
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
	new \Getwid\Blocks\Testimonial()
);
