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

		add_filter( 'plugin_row_meta', array( $this, 'plugin_row_meta' ), 10, 2 );
		add_filter( 'plugin_action_links_' . GETWID_PLUGIN_BASENAME, array( $this, 'plugin_action_links' ) );
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
