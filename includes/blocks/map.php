<?php

add_action( 'wp_ajax_getwid_api_key', 'getwid_google_api_key' );

function getwid_google_api_key() {
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

register_block_type(
    'getwid/map'
);