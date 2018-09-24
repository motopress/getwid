<?php

namespace Getwid;

class Settings {

	private $version = '0.0.0';
	private $prefix = 'getwid';
	private $pluginName = 'Getwid';

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