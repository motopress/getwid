<?php

namespace Getwid\Blocks;

class Accordion {

    private $blockName = 'getwid/accordion';

    public function __construct() {
        add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );

        register_block_type(
            'getwid/accordion',
            array(
                'render_callback' => [ $this, 'render_block' ]
            )
        );
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

new \Getwid\Blocks\Accordion();