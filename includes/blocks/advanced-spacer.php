<?php

namespace Getwid\Blocks;

class AdvancedSpacer extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/advanced-spacer';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/advanced-spacer',
			array(
				'render_callback' => [ $this, 'render_callback' ]
			)
		);

	}

	public function getLabel() {
		return __('Advanced Spacer', 'getwid');
	}

    private function block_frontend_assets( $attributes = null ) {

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
    }

    public function render_callback( $attributes, $content ) {

        $this->block_frontend_assets( $attributes );

        return $content;
    }

}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\AdvancedSpacer()
);
