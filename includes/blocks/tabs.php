<?php

namespace Getwid\Blocks;

class Tabs {

    private $blockName = 'getwid/tabs';

    public function __construct() {

        add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );

        register_block_type(
            'getwid/tabs',
            array(
                'render_callback' => [ $this, 'render_block' ]
            )
        );
    }

    public function block_editor_scripts($scripts) {

        //jquery-ui-tabs.min.js
		if ( ! in_array( 'jquery-ui-tabs', $scripts ) ) {
            array_push( $scripts, 'jquery-ui-tabs' );
        }

        return $scripts;
    }

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }

		//jquery-ui-tabs.min.js
        if ( ! wp_script_is( 'jquery-ui-tabs', 'enqueued' ) ) {
            wp_enqueue_script('jquery-ui-tabs');
        }
    }

    public function render_block( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }    
}

new \Getwid\Blocks\Tabs();