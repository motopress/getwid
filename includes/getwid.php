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

	/**
	 * @var WritingSettings
	 */
	private $writingSettings;

	/**
	 * @var RestAPI
	 */
	private $restAPI;

	/**
	 * @var PostTemplatePart
	 */
	private $postTemplatePart;

	/**
	 * @var AllowedCssTags
	 */
	private $allowedCssTags;	

	/**
	 * @var Mailer
	 */
	private $mailer;

	private function __construct() {
		$this->scriptsManager   = new ScriptsManager();
		$this->fontIconsManager = new FontIconsManager();
		$this->blocksManager    = new BlocksManager();
		$this->versionControl   = new VersionControl();
		$this->writingSettings  = new WritingSettings();
		$this->restAPI          = new RestAPI();
		$this->postTemplatePart = new PostTemplatePart();
		$this->allowedCssTags   = new AllowedCssTags();
		$this->mailer           = new Mailer();
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
     * @return BlocksManager
     */
    public function getMailer(){
        return $this->mailer;
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
