<?php

namespace Getwid\Blocks;

class Accordion extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/accordion';

    public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/accordion',
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
		return __('Accordion', 'getwid');
	}

    public function block_editor_scripts($scripts) {

		//jquery-ui-accordion.min.js
        if ( ! in_array( 'jquery-ui-accordion', $scripts ) ) {
            array_push( $scripts, 'jquery-ui-accordion' );
        }

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

		//jquery-ui-accordion.min.js
        if ( ! wp_script_is( 'jquery-ui-accordion', 'enqueued' ) ) {
            wp_enqueue_script('jquery-ui-accordion');
        }
    }

    public function render_callback( $attributes, $content ) {

        $this->block_frontend_scripts();

        return $content;
    }
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\Accordion()
);
