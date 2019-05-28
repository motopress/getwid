<?php

namespace Getwid;

class Settings {

	private $version;
	private $prefix;
	private $pluginName;
	private $pluginData;

	/**
	 * Settings constructor.
	*/
	public function __construct() {

		if( !function_exists('get_plugin_data') ){
		    require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		}
	    $this->pluginData = get_plugin_data(GETWID_PLUGIN_FILE);

	    $this->version = $this->pluginData['Version'];
	    $this->prefix = $this->pluginData['TextDomain'];
	    $this->pluginName = $this->pluginData['Name'];

/*		add_filter('admin_body_class', [ $this, 'custom_admin_body_classes' ]);
		add_filter('body_class', [ $this, 'custom_body_classes' ]);*/

		//Add block category
		add_filter( 'block_categories', function( $categories, $post ) {
			return array_merge(
				$categories,
				array(
					array(
						'slug' => 'getwid-blocks',
						'title' => __( 'Getwid Blocks', 'getwid' ),
					),
				)
			);
		}, 10, 2 );
		
		//Add post-block category
		add_filter( 'block_categories', function( $categories, $post ) {
			return array_merge(
				$categories,
				array(
					array(
						'slug' => 'getwid-post-blocks',
						'title' => __( 'Getwid Post Blocks', 'getwid' ),
					),
				)
			);
		}, 10, 2 );
	}

/*	public function custom_admin_body_classes($classes){
        return "$classes getwid_back_end";
	}

	public function custom_body_classes($classes){
        $classes[] = 'getwid_front_end';
        return $classes;
	}*/

	/**
	 * @return string
	 */
	public function getVersion() {
		return $this->version;
	}

	/**
	 * @return string
	 */
	public function getPrefix() {
		return $this->prefix;
	}

	/**
	 * @return string
	 */
	public function getPluginName() {
		return $this->pluginName;
	}
}