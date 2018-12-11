<?php

namespace Getwid;

/**
 * Class ScriptsManager
 * @package Getwid
 */
class ScriptsManager {

	private $version;
	private $prefix;

	/**
	 * ScriptsManager constructor.
	 *
	 * @param Settings $settings Plugin settings
	 *
	 */
	public function __construct( $settings ) {
		$this->version = $settings->getVersion();
		$this->prefix  = $settings->getPrefix();

		add_action( 'wp_enqueue_scripts', [$this, 'enqueueScriptsAndStyles'], 5 );
		add_action( 'admin_enqueue_scripts', [$this, 'enqueueScriptsAndStyles'], 5 );

		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueueEditorAssets' ] );
		add_action( 'enqueue_block_assets', [ $this, 'enqueueBlockAssets' ] );
		add_action( 'enqueue_block_assets', [ $this, 'enqueueFrontBlockAssets' ] );
	}	

	public function enqueueScriptsAndStyles(){

		wp_enqueue_script(
			'getwid-slick',
			getwid_get_plugin_url('vendors/slick/slick/slick.min.js'),
			[ 'jquery' ],
			$this->version
		);

		wp_enqueue_script(
			'getwid-wow',
			getwid_get_plugin_url('node_modules/wow.js/dist/wow.min.js'),
			['jquery'],
			$this->version
		);

		wp_enqueue_style(
			'getwid-slick',
			getwid_get_plugin_url('vendors/slick/slick/slick.css'),
			[],
			$this->version
		);

		wp_enqueue_style(
			'getwid-slick-theme',
			getwid_get_plugin_url('vendors/slick/slick/slick-theme.css'),
			[],
			$this->version
		);

		wp_enqueue_style(
			'getwid-animate',
			getwid_get_plugin_url('node_modules/animate.css/animate.min.css'),
			[],
			$this->version
		);
	}

	/**
	 * Enqueue editor-only js and css
	 */
	public function enqueueEditorAssets() {

		// Enqueue the bundled block JS file
		wp_enqueue_script(
			"{$this->prefix}-blocks-editor-js",
			getwid_get_plugin_url( 'assets/js/editor.blocks.js' ),
			[
				'wp-i18n',
				'wp-editor',
				'wp-element',
				'wp-blocks',
				'wp-components',
				'getwid-slick',
				'getwid-wow',
				'jquery-ui-tabs',
				'jquery-ui-accordion',
				// 'jquery-ui-draggable'
			],
			$this->version
		);

		wp_localize_script(
			"{$this->prefix}-blocks-editor-js",
			'Getwid',
			apply_filters( 'getwid_localize_blocks_js_data', [
				'localeData' => function_exists( 'wp_set_script_translations' ) ? wp_set_script_translations( 'my-handle', 'getwid' ) : '',
				// 'localeData' => function_exists( 'wp_set_script_translations' ) ? wp_set_script_translations( 'getwid' ) : '',
				'settings'   => [],
			] )
		);

		wp_enqueue_style(
			'getwid-fonticonpicker-base-theme',
			getwid_get_plugin_url('node_modules/@fonticonpicker/react-fonticonpicker/dist/fonticonpicker.base-theme.react.css'),
			null,
			$this->version
		);

		wp_enqueue_style(
			'getwid-fonticonpicker-react-theme',
			getwid_get_plugin_url('node_modules/@fonticonpicker/react-fonticonpicker/dist/fonticonpicker.material-theme.react.css'),
			null,
			$this->version
		);

		// Enqueue optional editor only styles
		wp_enqueue_style(
			"{$this->prefix}-blocks-editor-css",
			getwid_get_plugin_url( 'assets/css/blocks.editor.css' ),
			null,
			// [ 'wp-blocks', 'getwid-fonticonpicker-base-theme', 'getwid-fonticonpicker-react-theme' ],
			$this->version
		);
	}

	/**
	 * Enqueue editor & frontend js and css
	 */
	public function enqueueBlockAssets() {
		wp_enqueue_style(
			"{$this->prefix}-blocks-css",
			getwid_get_plugin_url( 'assets/css/blocks.style.css' ),
			null,
			// apply_filters( 'getwid_blocks_style_dependencies', ['wp-blocks', 'getwid-slick', 'getwid-slick-theme', 'getwid-animate'] ),
			$this->version
		);
	}

	/**
	 * Enqueue frontend-only block js and css
	 */
	public function enqueueFrontBlockAssets() {
		if ( is_admin() ) {
			return;
		}

		wp_enqueue_script(
			"{$this->prefix}-blocks-frontend-js",
			getwid_get_plugin_url( 'assets/js/frontend.blocks.js' ),
			[ 'getwid-slick', 'getwid-wow', 'jquery-ui-tabs', 'jquery-ui-accordion', /*'jquery-ui-draggable'*/ ],
			$this->version
		);
	}

}