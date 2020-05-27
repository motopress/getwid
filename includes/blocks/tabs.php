<?php

namespace Getwid\Blocks;

class Tabs extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/tabs';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            'getwid/tabs',
            array(
                'render_callback' => [ $this, 'render_callback' ]
            )
        );

		if ( $this->isEnabled() ) {

			add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );
		}
    }

	public function getLabel() {
		return __('Tabs', 'getwid');
	}

    public function block_editor_scripts($scripts) {

        return $scripts;
    }

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }
    }

    public function render_callback( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\Tabs()
);