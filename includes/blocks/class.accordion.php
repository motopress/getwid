<?php

namespace Getwid\Blocks;

class Accordion {

    private $blockName = 'getwid/accordion';

    public function __construct() {
        add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );

        register_block_type(
            $this->blockName,
            array(
                'render_callback' => [ $this, 'render_block' ]
            )
        );
    }

    public function block_editor_scripts($scripts) {

        if ( ! in_array( 'jquery-ui-accordion', $scripts ) ) {
            array_push( $scripts, 'jquery-ui-accordion' );
        }

        return $scripts;
    }

    private function block_frontend_assets() {
        if ( is_admin() ) {
            return;
        }
    
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