<?php

namespace Getwid\Blocks;

class Toggle extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/toggle';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            'getwid/toggle'
        );

		if ( $this->isEnabled() ) {

			add_filter( 'getwid/blocks_style_css/dependencies', [ $this, 'block_frontend_styles' ] );
		}
    }

	public function getLabel() {
		return __('Toggle', 'getwid');
	}

	public function block_frontend_styles($styles) {

		getwid_log( self::$blockName . '::hasBlock', $this->hasBlock() );

		//fontawesome
		$styles = \Getwid\FontIconsManager::getInstance()->enqueueFonts( $styles );

        return $styles;
    }
}

\Getwid\BlocksManager::getInstance()->addBlock(
	new \Getwid\Blocks\Toggle()
);
