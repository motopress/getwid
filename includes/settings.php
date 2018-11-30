<?php

namespace Getwid;

class Settings {

	private $version = '0.0.0';
	private $prefix = 'getwid';
	private $pluginName = 'Getwid';

	/**
	 * Settings constructor.
	*/
	public function __construct() {
		add_filter('admin_body_class', [ $this, 'custom_admin_body_classes' ]);
		add_filter('body_class', [ $this, 'custom_body_classes' ]);
	}

	public function custom_admin_body_classes($classes){
        return "$classes getwid_back_end";
	}

	public function custom_body_classes($classes){
        $classes[] = 'getwid_front_end';
        return $classes;
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