<?php
//  Exit if accessed directly.
if ( !defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Load translations from the MO file.
 */
function getwid_load_textdomain() {
    load_plugin_textdomain( 'getwid', false, plugin_basename( GETWID_PLUGIN_DIR ) . '/languages/' );
}

add_action( 'plugins_loaded', 'getwid_load_textdomain' );