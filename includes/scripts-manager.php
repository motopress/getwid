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

	public function getwid_load_locale_data() {
		$locale_data = $this->getwid_locale_data( 'gutenberg' );
		wp_add_inline_script(
			'wp-i18n',
			'wp.i18n.setLocaleData( ' . json_encode( $locale_data ) . ' );'
		);
	}

	public function getwid_locale_data( $domain ) {
		$translations = get_translations_for_domain( $domain );

		$locale = array(
			'' => array(
				'domain' => $domain,
				'lang'   => is_admin() ? get_user_locale() : get_locale(),
			),
		);

		if ( ! empty( $translations->headers['Plural-Forms'] ) ) {
			$locale['']['plural_forms'] = $translations->headers['Plural-Forms'];
		}

		foreach ( $translations->entries as $msgid => $entry ) {
			$locale[ $msgid ] = $entry->translations;
		}

		return $locale;
	}

	public function enqueueScriptsAndStyles(){

		wp_enqueue_script(
			'slick',
			getwid_get_plugin_url('vendors/slick/slick/slick.min.js'),
			[ 'jquery' ],
			'1.9.0'
		);

		wp_enqueue_script(
			'wow',
			getwid_get_plugin_url('vendors/wow.js/dist/wow.min.js'),
			['jquery'],
			'1.2.1'
		);

		wp_enqueue_style(
			'slick',
			getwid_get_plugin_url('vendors/slick/slick/slick.css'),
			[],
			'1.9.0'
		);

		wp_enqueue_style(
			'slick-theme',
			getwid_get_plugin_url('vendors/slick/slick/slick-theme.css'),
			[],
			'1.9.0'
		);

		wp_enqueue_style(
			'animate',
			getwid_get_plugin_url('vendors/animate.css/animate.min.css'),
			[],
			'3.7.0'
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
				'localeData' => $this->getwid_locale_data( 'getwid' ),
				'settings'   => [],
			] )
		);

		wp_enqueue_style(
			'getwid-fonticonpicker-base-theme',
			getwid_get_plugin_url('vendors/@fonticonpicker/react-fonticonpicker/dist/fonticonpicker.base-theme.react.css'),
			null,
			$this->version
		);

		wp_enqueue_style(
			'getwid-fonticonpicker-react-theme',
			getwid_get_plugin_url('vendors/@fonticonpicker/react-fonticonpicker/dist/fonticonpicker.material-theme.react.css'),
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