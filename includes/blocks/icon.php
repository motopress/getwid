<?php

namespace Getwid\Blocks;

class Icon extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/icon';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            'getwid/icon',
			array(
				'render_callback' => [ $this, 'render_callback' ]
			)
        );

		if ( $this->isEnabled() ) {

			add_filter( 'getwid/blocks_style_css/dependencies', [ $this, 'block_frontend_styles' ] );

			//Register JS/CSS assets
			wp_register_style(
				'animate',
				getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
				[],
				'3.7.0'
			);
		}
    }

	public function getLabel() {
		return __('Icon', 'getwid');
	}

    public function block_frontend_styles($styles) {

		getwid_log( self::$blockName . '::hasBlock', $this->hasBlock() );

		//fontawesome
		$styles = getwid()->fontIconsManager()->enqueueFonts( $styles );

		//animate.min.css
        if ( is_admin() && ! in_array( 'animate', $styles ) ) {
            array_push( $styles, 'animate' );
        }

        return $styles;
    }

    public function enqueue_block_frontend_styles() {

    	if ( is_admin() ) {
			return;
		}

		if ( ! wp_style_is( 'animate', 'enqueued' ) ) {
			wp_enqueue_style('animate');
		}

	}

    public function render_callback( $attributes, $content ) {

    	$this->enqueue_block_frontend_styles();

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\Icon()
);
