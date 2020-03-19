<?php

namespace Getwid\Blocks;

class Accordion extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/accordion';

    public function __construct() {

		parent::__construct( self::$blockName );

        add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );

        register_block_type(
            self::$blockName,
            array(
                'render_callback' => [ $this, 'render_block' ]
            )
        );
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

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }

		//jquery-ui-accordion.min.js
        if ( ! wp_script_is( 'jquery-ui-accordion', 'enqueued' ) ) {
            wp_enqueue_script('jquery-ui-accordion');
        }
    }

    public function render_block( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }
}

\Getwid\BlocksManager::getInstance()->addBlock(
	new \Getwid\Blocks\Accordion()
);
