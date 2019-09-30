<?php

namespace Getwid\Blocks;

class CircleProgressBar {

    private $blockName = 'getwid/circle-progress-bar';

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

        wp_register_script(
            'waypoints',
            getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
            [ 'jquery' ],
            '4.0.1',
            true
        );        

        if ( ! in_array( 'waypoints', $scripts ) ) {
            array_push( $scripts, 'waypoints' );
        }

        return $scripts;
    }

    private function getwid_block_frontend_assets() {
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

    public function getwid_render_block( $attributes, $content ) {
        $this->getwid_block_frontend_assets();
        return $content;
    }    
}

new \Getwid\Blocks\CircleProgressBar();