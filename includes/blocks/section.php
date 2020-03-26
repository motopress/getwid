<?php

namespace Getwid\Blocks;

class Section extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/section';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            self::$blockName,
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

		getwid_log( self::$blockName, $this->hasBlock() );

		if ( !is_admin() && !$this->hasBlock() && !has_getwid_nested_blocks() ) {
			return $styles;
		}

		//fontawesome
		$styles = \Getwid\FontIconsManager::getInstance()->enqueueDefaultFont( $styles );

        //animate.min.css
		if ( ! in_array( 'animate', $styles ) ) {
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

        return $scripts;
    }

    private function block_frontend_assets( $attributes = null ) {

        if ( is_admin() ) {
            return;
        }

        //wow.min.js
		if ( ! empty( $attributes['entranceAnimation'] ) && ! wp_script_is( 'wow', 'enqueued' ) ) {
            wp_enqueue_script('wow');
        }

        //slick.min.js
		if ( ! wp_script_is( 'slick', 'enqueued' ) ) {
            wp_enqueue_script('slick');
        }

    }

    public function render_callback( $attributes, $content ) {

		$this->block_frontend_assets( $attributes );

        return $content;
    }
}

\Getwid\BlocksManager::getInstance()->addBlock(
	new \Getwid\Blocks\Section()
);
