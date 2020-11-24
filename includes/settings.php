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
	}

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
