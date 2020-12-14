<?php

namespace Getwid;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

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
	 * @var TokenManager
	 */
	//private $tokenManager;

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

		require_once GETWID_PLUGIN_DIR . 'includes/load.php';

		add_action( 'init', array( $this, 'init' ), 0 );

		add_filter( 'plugin_row_meta', array( $this, 'plugin_row_meta' ), 10, 2 );
		add_filter( 'plugin_action_links_' . GETWID_PLUGIN_BASENAME, array( $this, 'plugin_action_links' ) );
	}

	/**
	 * Init Getwid when WordPress Initialises.
	 */
	public function init() {
		$this->settings   		= new Settings();
		$this->versionControl   = new VersionControl();
		$this->scriptsManager   = new ScriptsManager();
		$this->fontIconsManager = new FontIconsManager();
		$this->blocksManager    = new BlocksManager();
		//$this->tokenManager     = new TokenManager();
		$this->writingSettings  = new WritingSettings();
		$this->restAPI          = new RestAPI();
		$this->postTemplatePart = new PostTemplatePart();
		$this->allowedCssTags   = new AllowedCssTags();
		$this->mailer           = new Mailer();
	}

    /**
     * @return ScriptsManager
     */
    public function scriptsManager(){
        return $this->scriptsManager;
    }

    /**
     * @return FontIconsManager
     */
    public function fontIconsManager(){
        return $this->fontIconsManager;
    }

    /**
     * @return BlocksManager
     */
    public function blocksManager(){
        return $this->blocksManager;
    }

    /**
     * @return TokenManager
     */
    /*public function tokenManager(){
        return $this->tokenManager;
    }*/

    /**
     * @return VersionControl
     */
    public function versionControl(){
        return $this->versionControl;
    }

    /**
     * @return WritingSettings
     */
    public function writingSettings(){
        return $this->writingSettings;
    }

    /**
     * @return RestAPI
     */
    public function restAPI(){
        return $this->restAPI;
    }

    /**
     * @return PostTemplatePart
     */
    public function postTemplatePart(){
        return $this->postTemplatePart;
    }

    /**
     * @return AllowedCssTags
     */
    public function allowedCssTags(){
        return $this->allowedCssTags;
    }

    /**
     * @return Mailer
     */
    public function mailer(){
        return $this->mailer;
    }

	/**
     * @return Settings
     */
    public function settings(){
        return $this->settings;
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

	public function is_rest_api_request() {

		if ( empty( $_SERVER['REQUEST_URI'] ) ) {
			return false;
		}

		$rest_prefix         = trailingslashit( rest_get_url_prefix() );
		$is_rest_api_request = ( false !== strpos( $_SERVER['REQUEST_URI'], $rest_prefix ) );

		return apply_filters( 'getwid/is_rest_api_request', $is_rest_api_request );
	}

	/**
	 * Show row meta on the plugin screen.
	 *
	 * @return array
	 */
	public function plugin_row_meta( $links, $file ) {

		if ( GETWID_PLUGIN_BASENAME === $file ) {

			$row_meta = array(
				'support' => '<a href="' . esc_url( 'https://wordpress.org/support/plugin/getwid/' ) . '" aria-label="' .
					esc_attr__( 'Support', 'getwid' ) . '">' . esc_html__( 'Support', 'getwid' ) . '</a>',
				'review' => '<a href="' . esc_url( 'https://wordpress.org/support/plugin/getwid/reviews/' ) . '" aria-label="' .
					esc_attr__( 'Write a Review', 'getwid' ) . '">' . esc_html__( 'Write a Review', 'getwid' ) . '</a>',
			);

			return array_merge( $links, $row_meta );
		}

		return (array) $links;
	}

	public function plugin_action_links( $actions ) {

		if ( current_user_can( 'manage_options' ) ) {
			return array_merge(
				$actions,
				array( 'settings' => sprintf( '<a href="%s">%s</a>', admin_url( 'options-writing.php#getwid-settings' ), __( 'Settings', 'getwid' ) ) )
			);
		}

		return $actions;
	}

}