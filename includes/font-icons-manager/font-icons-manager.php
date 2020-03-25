<?php

namespace Getwid;

class FontIconsManager {

	private static $instance = null;

	private $defaultFontHandle = 'fontawesome-free';
	private $defaultFontName = 'fontawesome';

	/**
	 * @var array
	 */
	private $fonts;

	public function __construct() {

		add_action( 'init', [ $this, 'extendFontIcons' ] );

		add_filter( 'getwid/editor_blocks_js/localize_data', [ $this, 'setIconsListLocalizeData' ] );
		add_filter( 'getwid/editor_blocks_css/dependencies', [ $this, 'enqueueDefaultFont' ] );

	}

	public static function getInstance() {
		if (self::$instance == null) {
			self::$instance = new FontIconsManager();
		}
		return self::$instance;
	}

	public function getFonts() {
		return $this->fonts;
	}

	public function getDefaultFontHandle() {
		return apply_filters(
			'getwid/icons-manager/default-font-handle',
			$this->defaultFontHandle
		);
	}

	public function getDefaultFontName() {
		return $this->defaultFontName;
	}

	public function extendFontIcons() {

		$this->registerFontAwesome();

		do_action( 'getwid/icons-manager/init', $this );
	}

	private function registerFontAwesome() {

		/**
		 * Register FontAwesome by default
		 *
		 * Blocks with FontAwesome icons:
		 *    video-popup
		 *    image-hotspot
		 *    toggle
		 *    accordion
		 *    icon
		 *    social-links
		 *    icon-box
		 *    section
		 *    template-post-tags
		 *    template-post-date
		 *    template-post-categories
		 *    template-post-comments
		 *    template-post-author
		 *
		 */
		$this->registerFont(
			$this->getDefaultFontName(),
			[
				'icons' => require( GETWID_PLUGIN_DIR . 'includes/data-list/font-awesome-icon-list.php' ),
				'handle' => $this->getDefaultFontHandle(),
				'src' => getwid_get_plugin_url( 'vendors/fontawesome-free/css/all.min.css' ),
				'deps' => null,
				'ver' => '5.5.0',
			]
		);
	}

	/**
	 * @param string $fontName
	 * @param array  $args       Required. Array of icon font arguments.
	 *     @type array   $icons      Array of categories that contains icons
	 *     @type string  $handle     Handle of style
	 *     @type string  $src     	 Full URL of the stylesheet
	 * }
	 */
	public function registerFont( $fontName, $args ) {

		if ( strlen( $fontName ) ) {

			$this->fonts[ $fontName ] = $args;

			//https://developer.wordpress.org/reference/functions/wp_register_style/
			return wp_register_style(
				$args['handle'],
				$args['src'],
				$args['deps'],
				$args['ver']
			);
		}

		return false;
	}

	/**
	 * @param string $fontName
	 */
	public function deregisterFont( $fontName ) {

		if ( isset( $this->fonts[ $fontName ] ) ) {

			wp_deregister_style( fonts[ $fontName ]['handle'] );
			unset ( $this->fonts[ $fontName ] );
		}
	}

	/**
	 * @return array
	 */
	private function getCategorizedIconList() {

		$iconsByFonts = array_values( array_column( $this->fonts, 'icons' ) );
		$buff_arr = [];

		foreach($iconsByFonts as $iconsArrs){
		    if(!empty($iconsArrs)){
		    	$buff_arr = array_merge($buff_arr, $iconsArrs);
		    }
		}
		return count( $iconsByFonts ) > 1 ? $buff_arr : current( $iconsByFonts );
	}

	/**
	 * @param array $localizeData
	 *
	 * @return array
	 */
	public function setIconsListLocalizeData( $localizeData ) {

		$localizeData['settings']['iconList'] = $this->getCategorizedIconList();
		return $localizeData;

	}

	/**
	 * @param array $deps
	 *
	 * @return array
	 */
	public function enqueueDefaultFont( $deps ) {

		if ( ! in_array( $this->getDefaultFontHandle(), $deps ) && wp_style_is( $this->getDefaultFontHandle(), 'registered' ) ) {
			$deps[] = $this->getDefaultFontHandle();
		}
		return $deps;
	}

}
