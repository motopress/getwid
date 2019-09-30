<?php

namespace Getwid\Blocks;

class Accordion {

    private $blockName = 'getwid/accordion';

    public function __construct() {

        add_action( 'enqueue_block_editor_assets', [ $this, 'getwid_block_load_dependency'], 20 );

        register_block_type(
            $this->blockName,
            array(
                'editor_script' => 'getwid-blocks-editor-js',
                'editor_style'  => 'getwid-blocks-editor',
                'render_callback' => [ $this, 'getwid_render_block' ]
            )
        );
    }

    public function getwid_block_load_dependency() {
        add_filter( 'getwid/editor_blocks_js/load_scripts', [ $this, 'getwid_block_editor_scripts'] );
    }

    public function getwid_block_editor_scripts( $scripts = [] ) {

        if ( ! in_array( 'jquery-ui-accordion', $scripts ) ) {
            array_push( $scripts, 'jquery-ui-accordion' );
        }

        return $scripts;
    }

    private function getwid_block_frontend_assets() {
        if ( is_admin() ) {
            return;
        }
    
        if ( ! wp_script_is( 'jquery-ui-accordion', 'enqueued' ) ) {
            wp_enqueue_script('jquery-ui-accordion');
        }
    }

    public function getwid_render_block( $attributes, $content ) {
        $this->getwid_block_frontend_assets();
        return $content;
    }    
}

new \Getwid\Blocks\Accordion();