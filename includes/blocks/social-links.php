<?php

namespace Getwid\Blocks;

class SocialLinks extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/social-links';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            'getwid/social-links'
        );

		if ( $this->isEnabled() ) {

			add_filter( 'getwid/blocks_style_css/dependencies', [ $this, 'block_frontend_styles' ] );
		}
    }

	public function getLabel() {
		return __('Social Links', 'getwid');
	}

	public function block_frontend_styles($styles) {

		getwid_log( self::$blockName . '::hasBlock', $this->hasBlock() );

		//fontawesome
		$styles = getwid()->fontIconsManager()->enqueueFonts( $styles );

        return $styles;
    }
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\SocialLinks()
);
