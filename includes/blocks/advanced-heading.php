<?php

namespace Getwid\Blocks;

class AdvancedHeading extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/advanced-heading';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            'getwid/advanced-heading',
            array(
                'render_callback' => [ $this, 'render_callback' ]
            )
        );
    }

	public function getLabel() {
		return __('Advanced Heading', 'getwid');
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
			getwid_get_plugin_url( 'assets/blocks/advanced-heading/style.css' ),
			[],
			getwid()->settings()->getVersion()
		);
    }

    public function render_callback( $attributes, $content ) {

        if ( isset( $attributes['fontWeight'] ) &&
			( $attributes['fontWeight'] == 'regular' || $attributes['fontWeight'] == 'normal') ) {

            $attributes['fontWeight'] = '400';
        }

        $should_load_gf = $this->shouldLoadGoogleFont( $attributes );

		if ( $should_load_gf ) {

			$fontFamily = $attributes['fontFamily'];

			$fontFamilyHandle = strtolower( preg_replace( '/\s+/', '_', $fontFamily ) );

			$fontWeight = '';
			$fontWeightHandle = '';
			$fontWeightPart = '';
			if ( isset( $attributes['fontWeight'] ) && $attributes['fontWeight'] != '400' ) {
				$fontWeight = $attributes['fontWeight'];
				$fontWeightHandle = '_' . $fontWeight;
				$fontWeightPart = ':' . $fontWeight;
			}

			wp_enqueue_style(
				'google-font-' . esc_attr( $fontFamilyHandle ) . esc_attr( $fontWeightHandle ),
				'https://fonts.googleapis.com/css?family=' . esc_attr( $fontFamily ) . esc_attr( $fontWeightPart ),
				null,
				'all'
			);
		}

		$this->block_frontend_assets();

        return $content;
    }

    private function shouldLoadGoogleFont( $attributes ) {
    	$should_load = false;

    	// if fontFamily set maybe GF should be loaded
		if ( isset( $attributes['fontFamily'] ) && !empty( $attributes['fontFamily'] ) ) {
			$should_load = true;
		}

		// if fontGroupID isset but not equal to 'google-fonts' it shouldn't be loaded
		// if fontGroupID is not set(older plugin versions) the condition above will do all the work
		if ( $should_load && isset( $attributes['fontGroupID'] ) && $attributes['fontGroupID'] != 'google-fonts' ) {
			$should_load = false;
		}

		return $should_load;
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\AdvancedHeading()
);
