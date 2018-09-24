<?php
//  Exit if accessed directly.
if ( !defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Load translations from the MO file.
 */
function getwid_load_textdomain() {
	load_plugin_textdomain( 'getwid', false, getwid_get_plugin_path( 'languages' ) );
}

add_action( 'init', 'getwid_load_textdomain' );