<?php
/**
 * Plugin Name: Getwid
 * Plugin URI: https://motopress.com/products/getwid/
 * Description: Extra Gutenberg blocks for building seamless and aesthetic websites in the WordPress block editor.
 * Version: 1.5.2
 * Author: MotoPress
 * Author URI: https://motopress.com/
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: getwid
 * Domain Path: /languages
 */

//  Exit if accessed directly.
if ( !defined( 'ABSPATH' ) ) {
	exit;
}

if ( !class_exists( 'Getwid\Getwid' ) ) {

	define( 'GETWID_PLUGIN_FILE', __FILE__ );
	define( 'GETWID_PLUGIN_DIR', plugin_dir_path( __FILE__ ) ); // The path with trailing slash

	require_once plugin_dir_path( __FILE__ ) . 'includes/load.php';

    function getwid() {
        return \Getwid\Getwid::getInstance();
    }

	// Init Getwid
    getwid();

}
