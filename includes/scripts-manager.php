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

		add_action( 'wp_ajax_getwid_api_key', [ $this, 'getwid_google_api_key' ] );

		add_action( 'after_theme_setup', [ $this, 'getwid_enqueue_editor_section_css' ] );
	}

	public function getwid_google_api_key() {

		$action = $_POST['option'];
		$data = $_POST['data'];
		$nonce = $_POST['nonce'];

		if ( ! wp_verify_nonce( $nonce, 'getwid_google_api_key' ) ) {
			wp_send_json_error();
		}

		$response = false;
		if ($action == 'set') {
			$response = update_option( 'getwid_google_api_key', $data );
		} elseif ($action == 'delete') {
			$response = delete_option( 'getwid_google_api_key');
		}

		wp_send_json_success( $response );
	}

	public function getwid_get_image_sizes() {

		global $_wp_additional_image_sizes;

		$intermediate_image_sizes = get_intermediate_image_sizes();

		$image_sizes = array();
		foreach ( $intermediate_image_sizes as $size ) {
			if ( isset($_wp_additional_image_sizes[$size]) ) {
				$image_sizes[$size] = array(
					'width'  => $_wp_additional_image_sizes[$size]['width'],
					'height' => $_wp_additional_image_sizes[$size]['height'],
				);
			} else {
				$image_sizes[$size] = array(
					'width'  => intval( get_option( "{$size}_size_w" ) ),
					'height' => intval( get_option( "{$size}_size_h" ) ),
				);
			}
		}

		$sizes_arr = [];
		foreach ($image_sizes as $key => $value) {
			$temp_arr = [];
			$temp_arr['value'] = $key;
			$temp_arr['label'] = ucwords(strtolower(preg_replace('/[-_]/', ' ', $key))). " - {$value['width']} x {$value['height']}";
			$sizes_arr[] = $temp_arr;
		}

		$sizes_arr[] = array(
			'value' => 'full',
			'label' => __('Full Size', 'getwid')
		);

		return $sizes_arr;
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
		//Scripts
		wp_enqueue_script(
			'slick',
			getwid_get_plugin_url('vendors/slick/slick/slick.min.js'),
			['jquery'],
			'1.9.0',
			true
		);

		wp_enqueue_script(
			'wow',
			getwid_get_plugin_url('vendors/wow.js/dist/wow.min.js'),
			['jquery'],
			'1.2.1',
			true
		);

		wp_enqueue_script(
			'imagesloaded',
			getwid_get_plugin_url('vendors/imagesloaded/imagesloaded.pkgd.min.js'),
			['jquery'],
			'4.1.4',
			true
		);


		//Styles
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
				'wp-api',
				'wp-api-fetch',
				'slick',
				'wow',
				'jquery-ui-tabs',
				'jquery-ui-accordion',
			],
			$this->version,
			true
		);

		wp_localize_script(
			"{$this->prefix}-blocks-editor-js",
			'Getwid',
			apply_filters( 'getwid_localize_blocks_js_data', [
				'localeData' => $this->getwid_locale_data( 'getwid' ),
				'settings'   => [
					'google_api_key'   => get_option('getwid_google_api_key', ''),
					'assets_path' => getwid_get_plugin_url('/assets'),
					'image_sizes' => $this->getwid_get_image_sizes(),
				],
				'ajax_url'   => admin_url( 'admin-ajax.php' ),
				'nonces' => array(
					'google_api_key' => wp_create_nonce( 'getwid_google_api_key' ),
				)
			] )
		);

		wp_enqueue_style(
			'fonticonpicker-base-theme',
			getwid_get_plugin_url('vendors/fonticonpicker/react-fonticonpicker/dist/fonticonpicker.base-theme.react.css'),
			null,
			'1.2.0'
		);

		wp_enqueue_style(
			'fonticonpicker-react-theme',
			getwid_get_plugin_url('vendors/fonticonpicker/react-fonticonpicker/dist/fonticonpicker.material-theme.react.css'),
			null,
			'1.2.0'
		);

		// Enqueue optional editor only styles
		wp_enqueue_style(
			"{$this->prefix}-blocks-editor-css",
			getwid_get_plugin_url( 'assets/css/blocks.editor.css' ),
			null,
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
			// apply_filters( 'getwid_blocks_style_dependencies', ['wp-blocks', 'slick', 'slick-theme', 'animate'] ),
			$this->version
		);

		wp_add_inline_style("{$this->prefix}-blocks-css", getwid_generate_section_content_width_css());
	}

	/**
	 * Enqueue frontend-only block js and css
	 */
	public function enqueueFrontBlockAssets() {
		if ( is_admin() ) {
			return;
		}

		//Function to check exist block on page
		//has_block()

		wp_enqueue_script(
			"{$this->prefix}-blocks-frontend-js",
			getwid_get_plugin_url( 'assets/js/frontend.blocks.js' ),
			[ 'slick', 'wow', 'jquery-ui-tabs', 'jquery-ui-accordion', 'lodash' /*'jquery-ui-draggable'*/ ],
			$this->version,
			true
		);

		wp_localize_script(
			"{$this->prefix}-blocks-frontend-js",
			'Getwid',
			[
				'settings'   => [
					'google_api_key'   => get_option('getwid_google_api_key', ''),
				],
				'ajax_url'   => admin_url( 'admin-ajax.php' ),
			]
		);		
	}

	function getwid_enqueue_editor_section_css(){
		add_editor_style(getwid_generate_section_content_width_css());
	}

}