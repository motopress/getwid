<?php
/**
 * Plugin Name: Getwid
 * Plugin URI: https://motopress.com/products/getwid/
 * Description: Extra Gutenberg blocks for building seamless and aesthetic websites in the WordPress block editor.
 * Version: 1.8.0
 * Author: MotoPress
 * Author URI: https://motopress.com/
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: getwid
 * Domain Path: /languages
 */

//  Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( !class_exists( 'Getwid\Getwid' ) ) {

	if ( ! defined( 'GETWID_PLUGIN_FILE' ) ) {
		define( 'GETWID_PLUGIN_FILE', __FILE__ );
	}
	if ( ! defined( 'GETWID_PLUGIN_DIR' ) ) {
		define( 'GETWID_PLUGIN_DIR', plugin_dir_path( __FILE__ ) ); // The path with trailing slash
	}
	if ( ! defined( 'GETWID_PLUGIN_BASENAME' ) ) {
		define( 'GETWID_PLUGIN_BASENAME', plugin_basename( GETWID_PLUGIN_FILE ) );
	}
	if ( ! defined( 'GETWID_DEBUG' ) ) {
		define( 'GETWID_DEBUG', false );
	}

	include_once GETWID_PLUGIN_DIR . 'includes/getwid.php';

    function getwid() {
        return \Getwid\Getwid::getInstance();
    }

	// Init Getwid
    getwid();

}
