<?php

namespace Getwid\Blocks;

class Toggle extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/toggle';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
			'getwid/toggle',
			array(
				'render_callback' => [ $this, 'render_callback' ]
			)
        );

		if ( $this->isEnabled() ) {

			add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );
			add_filter( 'getwid/blocks_style_css/dependencies', [ $this, 'block_frontend_styles' ] );
		}
    }

	public function getLabel() {
		return __('Toggle', 'getwid');
	}

	public function block_editor_scripts($scripts) {

        return $scripts;
    }

	public function block_frontend_styles($styles) {

		getwid_log( self::$blockName . '::hasBlock', $this->hasBlock() );

		//fontawesome
		$styles = getwid()->fontIconsManager()->enqueueFonts( $styles );

        return $styles;
	}

    private function block_frontend_scripts() {

        if ( is_admin() ) {
            return;
        }
    }

	public function render_callback( $attributes, $content ) {

        $this->block_frontend_scripts();

        return $content;
    }
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\Toggle()
);
