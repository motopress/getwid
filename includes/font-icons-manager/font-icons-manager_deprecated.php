<?php

namespace Getwid;

class FontIconsManager {

	/**
	 * @var array
	 */
	private $fonts;

	public function __construct() {
		add_action( 'init', [ $this, 'extendFontIcons' ] );
		add_filter( 'getwid/editor_blocks_js/localize_data', [ $this, 'setIconsListLocalizeData' ] );
	}

	public function getFonts() {
		return $this->fonts;
	}

	public function extendFontIcons() {

		$this->registerFontAwesome();

		do_action( 'getwid/icons-manager/init', $this );
	}

	private function registerFontAwesome() {
		// Register Font Awesome by default
		$this->registerFont( 'fontawesome', [
			'icons'             => require( GETWID_PLUGIN_DIR . 'includes/data-list/font-awesome-icon-list.php' ),
			'style'             => 'fontawesome-free',
            'enqueue_callback'  => [ $this, 'enqueueFontAwesome' ],
            'callback_priority' => 10,
		] );
	}

    public function enqueueFontAwesome(){
        wp_enqueue_style(
            'fontawesome-free',
            getwid_get_plugin_url( 'vendors/fontawesome-free/css/all.min.css' ),
            null,
            '5.5.0'
        );
    }

	/**
	 * @param string $fontName
	 * @param array  $args       {
	 *                           Optional. Array of icon font arguments. Any arguments may be defined, however the
	 *                           ones described below are supported by default. Default empty array.
	 *
	 * @type array   $icons      Array of categories that contains icons
	 * @type array   $style      Handle of style
	 * }
	 */
	public function registerFont( $fontName, $args ) {
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

            // Deregister the enqueue hook
            if ( !is_null( $this->fonts[ $fontName ][ 'enqueue_callback' ] ) ) {
                remove_action(
                    'enqueue_block_assets',
                    $this->fonts[ $fontName ][ 'enqueue_callback' ],
                    $this->fonts[ $fontName ][ 'callback_priority' ]
                );
            }

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

}