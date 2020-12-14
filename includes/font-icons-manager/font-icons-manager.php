<?php

namespace Getwid;

class FontIconsManager {

	private $defaultFontHandle = 'fontawesome-free';
	private $defaultFontName = 'fontawesome';

	/**
	 * @var array
	 */
	private $fonts;

	public function __construct() {

		add_action( 'init', [ $this, 'extendFontIcons' ] );

		add_filter( 'getwid/editor_blocks_js/localize_data', [ $this, 'setIconsListLocalizeData' ] );
		add_filter( 'getwid/editor_blocks_css/dependencies', [ $this, 'enqueueFonts' ] );

	}

	public function getFonts() {
		return $this->fonts;
	}

	public function getDefaultFontHandle() {
		return apply_filters(
			'getwid/icons_manager/default_font_handle',
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
		 *    - video-popup
		 *    - image-hotspot
		 *    - toggle
		 *    - accordion
		 *    - icon
		 *    - social-links
		 *    - icon-box
		 *    - section
		 *    - instagram
		 *    - template-post-tags
		 *    - template-post-date
		 *    - template-post-categories
		 *    - template-post-comments
		 *    - template-post-author
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
	 * @return boolean
	 */
	public function registerFont( $fontName, $args ) {

		// compatibility with 1.5.2
		if ( ! empty( $args['style'] ) ) {
			$this->deprecated_registerFont( $fontName, $args );
			return true;
		}

		// since 1.5.3
		if ( strlen( $fontName ) ) {

			$this->fonts[ $fontName ] = [
				'icons' => ! empty( $args['icons'] ) ? $args['icons'] : [],
				'handle' => ! empty( $args['handle'] ) ? $args['handle'] : '',
				'src' => ! empty( $args['src'] ) ? $args['src'] : false,
				'deps' => ! empty( $args['deps'] ) ? $args['deps'] : [],
				'ver' => ! empty( $args['ver'] ) ? $args['ver'] : false,
			];

			// https://developer.wordpress.org/reference/functions/wp_register_style/
			return wp_register_style(
				$this->fonts[ $fontName ]['handle'],
				$this->fonts[ $fontName ]['src'],
				$this->fonts[ $fontName ]['deps'],
				$this->fonts[ $fontName ]['ver']
			);
		}

		return false;
	}

	private function deprecated_registerFont( $fontName, $args ) {

		$this->fonts[ $fontName ] = [
			'icons'             => ! empty( $args['icons'] ) ? $args['icons'] : [],
			'style'             => ! empty( $args['style'] ) ? $args['style'] : '',
			'enqueue_callback'  => ! empty( $args['enqueue_callback'] ) ? $args['enqueue_callback'] : null,
			'callback_priority' => ! empty( $args['callback_priority'] ) ? $args['callback_priority'] : 10,
		];

		// Register the enqueue hook
		if ( !is_null( $this->fonts[ $fontName ][ 'enqueue_callback' ] ) ) {
			add_action(
				'enqueue_block_assets',
				$this->fonts[ $fontName ][ 'enqueue_callback' ],
				$this->fonts[ $fontName ][ 'callback_priority' ]
			);
		}
	}

	/**
	 * @param string $fontName
	 */
	public function deregisterFont( $fontName ) {

		if ( isset( $this->fonts[ $fontName ] ) ) {

			if ( array_key_exists( 'handle', $this->fonts[ $fontName ] ) ) {
				wp_deregister_style( $this->fonts[$fontName]['handle'] );
			} else {
				// compatibility with 1.5.2
				$this->deprecated_deregisterFont( $fontName );
			}

			unset ( $this->fonts[ $fontName ] );
		}
	}

	private function deprecated_deregisterFont( $fontName ) {
		if ( !is_null( $this->fonts[ $fontName ][ 'enqueue_callback' ] ) ) {
			remove_action(
				'enqueue_block_assets',
				$this->fonts[ $fontName ][ 'enqueue_callback' ],
				$this->fonts[ $fontName ][ 'callback_priority' ]
			);
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
	public function enqueueFonts( $deps ) {

		foreach ( $this->fonts as $name => $font ) {

			if ( ! array_key_exists( 'handle', $font ) ) {
				continue;
			}

			if ( ! in_array( $font['handle'], $deps ) && wp_style_is( $font['handle'], 'registered' ) ) {
				$deps[] = $font['handle'];
			}
		}

		return $deps;
	}

}
