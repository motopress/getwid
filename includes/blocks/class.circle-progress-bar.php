<?php

namespace Getwid\Blocks;

class CircleProgressBar {

    private $blockName = 'getwid/circle-progress-bar';

    public function __construct() {

        register_block_type(
            $this->blockName,
            array(
                'editor_script' => 'getwid-blocks-editor-js',
                'editor_style'  => 'getwid-blocks-editor',
                'render_callback' => [ $this, 'render_block' ]
            )
        );
    }

    private function block_frontend_assets() {
        if ( is_admin() ) {
            return;
        }
    
        if ( ! wp_script_is( 'waypoints', 'enqueued' ) ) {
            wp_enqueue_script(
                'waypoints',
                getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
                [ 'jquery' ],
                '4.0.1',
                true
            );
        }
    }

    public function render_block( $attributes, $content ) {
        $this->block_frontend_assets();
        return $content;
    }    
}

new \Getwid\Blocks\CircleProgressBar();