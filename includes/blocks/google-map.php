<?php

namespace Getwid\Blocks;

class GoogleMap {

    private $blockName = 'getwid/map';

    public function __construct() {

        add_action( 'wp_ajax_get_google_api_key', [ $this, 'get_google_api_key'] );
        add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );

        register_block_type(
            'getwid/map',
            array(
                'render_callback' => [ $this, 'render_block' ]
            )
        );

        wp_register_script(
            'getwid-map-styles',
            getwid_get_plugin_url( 'vendors/getwid/map-styles.min.js' ),
            [],
            '1.0.0',
            true
        );
    }

    public function block_editor_scripts($scripts) {

		//map-styles.min.js
        if ( ! in_array( 'getwid-map-styles', $scripts ) ) {
            array_push( $scripts, 'getwid-map-styles' );
        }

        return $scripts;
    }

    public function get_google_api_key() {
        $action = $_POST['option'];
        $data = $_POST['data'];
        $nonce = $_POST['nonce'];
    
        if ( ! wp_verify_nonce( $nonce, 'getwid_nonce_google_api_key' ) ) {
            wp_send_json_error();
        }
    
        $response = false;
        if ($action == 'get') {
            $response = get_option( 'getwid_google_api_key', '');
        } elseif ($action == 'set') {
            $response = update_option( 'getwid_google_api_key', $data );
        } elseif ($action == 'delete') {
            $response = delete_option( 'getwid_google_api_key' );
        }
    
        wp_send_json_success( $response );
    }

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }

		//map-styles.js
        if ( ! wp_script_is( 'getwid-map-styles', 'enqueued' ) ) {
            wp_enqueue_script( 'getwid-map-styles' );
        }

        $api_key = get_option( 'getwid_google_api_key', '' );
        
        if ( $api_key ) {
            wp_enqueue_script( 'google_api_key_js', "https://maps.googleapis.com/maps/api/js?key={$api_key}" );
        }
    }

    public function render_block( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }
}

new \Getwid\Blocks\GoogleMap();