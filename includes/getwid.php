<?php

namespace Getwid;

class Getwid {
	/**
	 * @var Settings
	 */
	private $settings;

	public function __construct() {
		$this->settings = new Settings();
		new ScriptsManager( $this->settings );
		new FontIconsManager();
		new BlocksManager( $this->settings );
	}
}