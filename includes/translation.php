<?php
//  Exit if accessed directly.
if ( !defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Load translations from the MO file.
 */
function getwid_load_textdomain() {
    load_plugin_textdomain( 'getwid', false, plugin_basename( plugin_dir_path( dirname( __FILE__ ) ) ) . '/languages/' );
}

add_action( 'plugins_loaded', 'getwid_load_textdomain' );