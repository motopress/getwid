<?php

namespace Getwid;

final class Getwid {
    /**
     * @var Getwid
     */
    private static $instance = null;

	/**
	 * @var Settings
	 */
	private $settings;

	/**
	 * @var ScriptsManager
	 */
    private $scriptsManager;

	/**
	 * @var FontIconsManager
	 */
    private $fontIconsManager;

	/**
	 * @var BlocksManager
	 */
    private $blocksManager;

    /**
     * @var VersionControl
     */
    private $versionControl;

	private function __construct() {
		$this->settings         = new Settings();
		$this->scriptsManager   = new ScriptsManager( $this->settings );
		$this->fontIconsManager = new FontIconsManager();
		$this->blocksManager    = new BlocksManager( $this->settings );
        $this->versionControl   = new VersionControl( $this->settings );
	}

    /**
     * @return ScriptsManager
     */
    public function getScriptsManager(){
        return $this->scriptsManager;
    }

    /**
     * @return FontIconsManager
     */
    public function getFontIconsManager(){
        return $this->fontIconsManager;
    }

    /**
     * @return BlocksManager
     */
    public function getBlocksManager(){
        return $this->blocksManager;
    }

    /**
     * @return Getwid
     */
    public static function getInstance(){
        if ( is_null( self::$instance ) ) {
            self::$instance = new self();
        }

        return self::$instance;
    }
}
