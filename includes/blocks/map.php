<?php

namespace Getwid\Blocks;

class Map {

    private $block_name = 'getwid/map';

    public function __construct() {

        add_action( 'wp_ajax_get_api_key', [ $this, 'get_google_api_key'] );

        register_block_type(
            $this->block_name,
            array(
                'render_callback' => [ $this, 'render_block' ]
            )
        );

        wp_register_script(
            'map-styles',
            getwid_get_plugin_url( 'src/utils/slick/map-styles.js' ),
            [],
            '1.0.0',
            true
        );
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

        if ( ! wp_script_is( 'map-styles', 'enqueued' ) ) {
            wp_enqueue_script(
                'map-styles',
                getwid_get_plugin_url( 'src/utils/slick/map-styles.js' ),
                [],
                '1.0.0',
                true
            );
        }
    }

    public function render_block( $attributes, $content ) {
        $this->block_frontend_assets();
        return $content;
    }
}

new \Getwid\Blocks\Map();


