<?php

namespace Getwid\Blocks;

class Section extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/section';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            'getwid/section',
            array(
                'render_callback' => [ $this, 'render_callback' ]
            )
        );

		if ( $this->isEnabled() ) {

			add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );
			add_filter( 'getwid/blocks_style_css/dependencies', [ $this, 'block_frontend_styles' ] );

			//Register JS/CSS assets
			wp_register_script(
				'wow',
				getwid_get_plugin_url( 'vendors/wow.js/dist/wow.min.js' ),
				[ 'jquery' ],
				'1.2.1',
				true
			);

			wp_register_script(
				'slick',
				getwid_get_plugin_url( 'vendors/slick/slick/slick.min.js' ),
				[ 'jquery' ],
				'1.9.0',
				true
			);

			wp_register_script(
				'draggabilly',
				getwid_get_plugin_url( 'vendors/draggabilly/draggabilly.pkgd.min.js' ),
				[ 'jquery' ],
				'2.2.0',
				true
			);

			wp_register_style(
				'animate',
				getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
				[],
				'3.7.0'
			);

			wp_register_style(
				'slick',
				getwid_get_plugin_url( 'vendors/slick/slick/slick.min.css' ),
				[],
				'1.9.0'
			);

			wp_register_style(
				'slick-theme',
				getwid_get_plugin_url( 'vendors/slick/slick/slick-theme.min.css' ),
				[],
				'1.9.0'
			);
		}
    }

	public function getLabel() {
		return __('Section', 'getwid');
	}

    public function block_frontend_styles($styles) {

		getwid_log( self::$blockName . '::hasBlock', $this->hasBlock() );

		//fontawesome
		$styles = getwid()->fontIconsManager()->enqueueFonts( $styles );

        //animate.min.css
		if ( is_admin() && ! in_array( 'animate', $styles ) ) {
            array_push( $styles, 'animate' );
        }

        //slick.min.css
		if ( ! in_array( 'slick', $styles ) ) {
            array_push( $styles, 'slick' );
        }

        //slick-theme.min.css
		if ( ! in_array( 'slick-theme', $styles ) ) {
            array_push( $styles, 'slick-theme' );
        }

        return $styles;
    }

    public function block_editor_scripts($scripts) {

        //wow.min.js
		if ( ! in_array( 'wow', $scripts ) ) {
            array_push( $scripts, 'wow' );
        }

        //wow.min.js
		if ( ! in_array( 'slick', $scripts ) ) {
            array_push( $scripts, 'slick' );
        }

		//draggabilly.pkgd.min.js
        if ( ! in_array( 'draggabilly', $scripts ) ) {
            array_push( $scripts, 'draggabilly' );
		}

        return $scripts;
    }

    private function block_frontend_assets( $attributes = [], $content = '' ) {

        if ( is_admin() ) {
            return;
        }

		if ( ! empty( $attributes['entranceAnimation'] ) ) {
			//wow.min.js
			if ( ! wp_script_is( 'wow', 'enqueued' ) ){
				wp_enqueue_script('wow');
			}

            //animate.min.css
			if ( ! wp_style_is( 'animate', 'enqueued' ) ) {
				wp_enqueue_style( 'animate' );
			}
        }

		//todo:
		$has_background_slider = false !== strpos( $content, 'wp-block-getwid-section__background-slider-item' );
        //slick.min.js
		if ( $has_background_slider && ! wp_script_is( 'slick', 'enqueued' ) ) {
            wp_enqueue_script('slick');
		}

		//imagesloaded.min.js
		if ( $has_background_slider && ! wp_script_is( 'imagesloaded', 'enqueued' ) ) {
			wp_enqueue_script('imagesloaded');
		}
    }

    public function render_callback( $attributes, $content ) {

		$this->block_frontend_assets( $attributes, $content );

        return $content;
    }
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\Section()
);