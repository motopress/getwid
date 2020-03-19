<?php

namespace Getwid\Blocks;

class Icon extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/icon';

    public function __construct() {

		parent::__construct( self::$blockName );

        add_filter( 'getwid/blocks_style_css/dependencies', [ $this, 'block_frontend_styles' ] );

        register_block_type(
            self::$blockName
        );

        //Register JS/CSS assets
        wp_register_style(
            'animate',
            getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
            [],
            '3.7.0'
        );
    }

    public function block_frontend_styles($styles) {

		gLog( self::$blockName, $this->hasBlock() );

		if ( !$this->hasBlock() && !getwid_has_nested_blocks() ) {
			return $styles;
		}

		//animate.min.css
        if ( ! in_array( 'animate', $styles ) ) {
            array_push( $styles, 'animate' );
        }

        return $styles;
    }
}

\Getwid\BlocksManager::addBlock(
	new \Getwid\Blocks\Icon()
);
