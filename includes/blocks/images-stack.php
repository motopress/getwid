<?php

namespace Getwid\Blocks;

class ImagesStack extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/images-stack';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/images-stack',
			array(
                'render_callback' => [ $this, 'render_callback' ]
            )
		);

	}

	public function getLabel() {
		return __('Image Stack Gallery', 'getwid');
	}

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }

		if ( FALSE == get_option( 'getwid_autoptimize', false ) ) {
			return;
		}

		wp_enqueue_style(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/images-stack/style.css' ),
			[],
			getwid()->settings()->getVersion()
		);
    }

    public function render_callback( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }

}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\ImagesStack()
);
