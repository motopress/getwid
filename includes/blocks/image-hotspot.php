<?php

namespace Getwid\Blocks;

class ImageHotspot extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/image-hotspot';

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
				'draggabilly',
				getwid_get_plugin_url( 'vendors/draggabilly/draggabilly.pkgd.min.js' ),
				[ 'jquery' ],
				'2.2.0',
				true
			);

			wp_register_script(
				'popper',
				getwid_get_plugin_url( 'vendors/tippy.js/popper.min.js' ),
				[ 'jquery' ],
				'1.15.0',
				true
			);

			wp_register_script(
				'tippy',
				getwid_get_plugin_url( 'vendors/tippy.js/index.all.min.js' ),
				[ 'jquery', 'popper' ],
				'4.3.5',
				true
			);

			wp_register_script(
				'waypoints',
				getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
				[ 'jquery' ],
				'4.0.1',
				true
			);

			wp_register_script(
				'unescape',
				getwid_get_plugin_url( 'vendors/lodash.unescape/unescape.min.js' ),
				[],
				'4.0.1',
				true
			);

			wp_register_style(
				'tippy-themes',
				getwid_get_plugin_url( 'vendors/tippy.js/themes.css' ),
				[],
				'4.3.5'
			);
		}
    }

	public function getLabel() {
		return __('Image Hotspot', 'getwid');
	}

    public function block_frontend_styles($styles) {

		getwid_log( self::$blockName . '::hasBlock', $this->hasBlock() );

		if ( !is_admin() && !$this->hasBlock() && !has_getwid_nested_blocks() ) {
			return $styles;
		}

		//fontawesome
		$styles = \Getwid\FontIconsManager::getInstance()->enqueueDefaultFont( $styles );

		//themes.css
        if ( ! in_array( 'tippy-themes', $styles ) ) {
            array_push( $styles, 'tippy-themes' );
        }

        return $styles;
    }

    public function block_editor_scripts($scripts) {

        //imagesloaded.min.js
		if ( ! in_array( 'imagesloaded', $scripts ) ) {
            array_push( $scripts, 'imagesloaded' );
		}

		//draggabilly.pkgd.min.js
        if ( ! in_array( 'draggabilly', $scripts ) ) {
            array_push( $scripts, 'draggabilly' );
		}

		//popper.min.js
        if ( ! in_array( 'popper', $scripts ) ) {
            array_push( $scripts, 'popper' );
		}

		//index.all.min.js
        if ( ! in_array( 'tippy', $scripts ) ) {
            array_push( $scripts, 'tippy' );
		}

        return $scripts;
    }

    private function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		//popper.min.js
		if ( ! wp_script_is( 'popper', 'enqueued' ) ) {
			wp_enqueue_script('popper');
		}

		//index.all.min.js
		if ( ! wp_script_is( 'tippy', 'enqueued' ) ) {
			wp_enqueue_script('tippy');
		}

		//jquery.waypoints.min.js
		if ( ! wp_script_is( 'waypoints', 'enqueued' ) ) {
			wp_enqueue_script('waypoints');
		}

		//unescape.min.js
		if ( ! wp_script_is( 'unescape', 'enqueued' ) ) {
			wp_enqueue_script( 'unescape' );
		}
    }

    public function render_callback( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }
}

\Getwid\BlocksManager::getInstance()->addBlock(
	new \Getwid\Blocks\ImageHotspot()
);
