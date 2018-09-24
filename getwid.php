<?php
/**
 * Plugin Name: Getwid
 * Plugin URI: https://motopress.com/products/ @todo Plugin URI
 * Description: @todo Description
 * Version: 0.0.0
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

if ( !class_exists( 'Getwid' ) ) {

	define( 'GETWID_PLUGIN_FILE', __FILE__ );

	//gutenberg_get_jed_locale_data
	require_once plugin_dir_path( __FILE__ ) . 'includes/load.php';

	// Init Getwid
	new \Getwid\Getwid();

}
