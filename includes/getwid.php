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

		$this->scriptsManager   = \Getwid\ScriptsManager::getInstance();
		$this->fontIconsManager = \Getwid\FontIconsManager::getInstance();
		$this->blocksManager    = \Getwid\BlocksManager::getInstance();
		$this->versionControl   = \Getwid\VersionControl::getInstance();
		$this->writingSettings  = \Getwid\WritingSettings::getInstance();
		$this->restAPI          = \Getwid\RestAPI::getInstance();
		$this->postTemplatePart = \Getwid\PostTemplatePart::getInstance();
		$this->allowedCssTags   = \Getwid\AllowedCssTags::getInstance();
		$this->mailer           = \Getwid\Mailer::getInstance();
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
