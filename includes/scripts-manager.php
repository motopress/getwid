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
	 */
	public function __construct() {

		$settings = getwid()->settings();

		$this->version = $settings->getVersion();
		$this->prefix  = $settings->getPrefix();

		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_block_assets' ) );

		// section_content_width inline styles
		add_action( 'after_theme_setup', array( $this, 'enqueue_editor_section_css' ) );

		add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend_common_assets' ) );
	}

	public function enqueue_block_editor_assets() {

		$this->setup_editor_global_data();

		$style_url  = getwid_get_plugin_url( '/assets/components/index.css' );
		$script_url = getwid_get_plugin_url( '/assets/components/index.js' );
		$asset_path = getwid_get_plugin_path( '/assets/components/index.asset.php' );

		if ( ! file_exists( $asset_path ) ) {
			return;
		}

		$asset = include $asset_path;

		wp_enqueue_script(
			'getwid-components',
			$script_url,
			$asset['dependencies'],
			$asset['version'],
		);

		$disabled_blocks      = array();
		$disabled_blocks_data = array();
		if ( getwid()->blocksManager()->hasDisabledBlocks() ) {
			$disabled_blocks = getwid()->blocksManager()->getDisabledBlocks();
			foreach ( $disabled_blocks as $block ) {
				$disabled_blocks_data[] = $block->get_block_name();
			}
		}

		$data = apply_filters(
			'getwid/editor_blocks_js/localize_data',
			array(
				'disabledBlocks' => $disabled_blocks_data,
				'optionsUrl'     => array(
					'general'    => getwid()->settingsPage()->getTabUrl( 'general' ),
					'appearance' => getwid()->settingsPage()->getTabUrl( 'appearance' ),
					'blocks'     => getwid()->settingsPage()->getTabUrl( 'blocks' ),
				),
				'templates'      => array(
					'name' => getwid()->postTemplatePart()->postType,
					'new'  => admin_url( 'post-new.php?post_type=' . getwid()->postTemplatePart()->postType ),
					'view' => admin_url( 'edit.php?post_type=' . getwid()->postTemplatePart()->postType ),
					'edit' => admin_url( 'post.php?post=' ),
				),
				'settings'       => array(
					'image_sizes' => $this->get_image_sizes(),
				),
			)
		);
		wp_add_inline_script( 'getwid-components', 'const GetwidComponentsData = ' . json_encode( $data ), 'before' );

		wp_enqueue_style(
			'getwid-components',
			$style_url,
			apply_filters(
				'getwid/editor_blocks_css/dependencies',
				array( 'wp-components' )
			),
			$asset['version']
		);

		wp_register_style(
			"{$this->prefix}-blocks-editor-common",
			getwid_get_plugin_url( 'assets/common-styles/editor.css' ),
			array(),
			$this->version
		);

		wp_style_add_data( "{$this->prefix}-blocks-editor-common", 'rtl', 'replace' );
	}

	public function enqueue_block_assets() {
		$this->register_frontend_common_assets();
		wp_enqueue_style( "{$this->prefix}-blocks-common" );
	}

	public function register_frontend_common_assets() {
		wp_register_style(
			"{$this->prefix}-blocks-common",
			getwid_get_plugin_url( 'assets/common-styles/style.css' ),
			array(),
			$this->version,
		);

		wp_style_add_data( "{$this->prefix}-blocks-common", 'rtl', 'replace' );
	}

	public function setup_editor_global_data() {
		$disabled_blocks      = array();
		$disabled_blocks_data = array();
		if ( getwid()->blocksManager()->hasDisabledBlocks() ) {
			$disabled_blocks = getwid()->blocksManager()->getDisabledBlocks();
			foreach ( $disabled_blocks as $block ) {
				$disabled_blocks_data[] = $block->getBlockName();
			}
		}

		$current_user_can_manage_options = current_user_can( 'manage_options' );

		$mailchimp_api_key = get_option( 'getwid_mailchimp_api_key', '' );

		if ( ! $current_user_can_manage_options ) {
			$mailchimp_api_key = $mailchimp_api_key ? '1' : '';
		}

		$recaptcha_site_key   = $current_user_can_manage_options ? get_option( 'getwid_recaptcha_v2_site_key', '' ) : '1';
		$recaptcha_secret_key = $current_user_can_manage_options ? get_option( 'getwid_recaptcha_v2_secret_key', '' ) : '1';

		$data = apply_filters(
			'getwid/editor_blocks_js/localize_data',
			array(
				'disabled_blocks'         => $disabled_blocks_data,
				'settings'                => array(
					'wide_support'          => get_theme_support( 'align-wide' ),
					'date_time_utc'         => current_time( 'Y-m-d H:i:s' ),
					'post_type'             => get_post_type(),
					'google_api_key'        => get_option( 'getwid_google_api_key', '' ),
					'instagram_token_isset' => (bool) get_option( 'getwid_instagram_token', '' ),

					'assets_path'           => getwid_get_plugin_url( '/assets' ),
					'image_sizes'           => $this->get_image_sizes(),

					'excerpt_length'        => apply_filters( 'excerpt_length', 55 ),
					'recaptcha_site_key'    => $recaptcha_site_key,
					'recaptcha_secret_key'  => $recaptcha_secret_key,
					'mailchimp_api_key'     => $mailchimp_api_key,
					'debug'                 => ( defined( 'WP_DEBUG' ) ? WP_DEBUG : false ),
				),
				'templates'               => array(
					'name' => getwid()->postTemplatePart()->postType,
					'new'  => admin_url( 'post-new.php?post_type=' . getwid()->postTemplatePart()->postType ),
					'view' => admin_url( 'edit.php?post_type=' . getwid()->postTemplatePart()->postType ),
					'edit' => admin_url( 'post.php?post=' ),
				),
				'ajax_url'                => admin_url( 'admin-ajax.php' ),
				'options_general_url'     => admin_url( 'options-general.php' ),
				'get_instagram_token_url' => add_query_arg(
					array( 'nonce' => wp_create_nonce( 'getwid_nonce_save_instagram_token' ) ),
					admin_url( 'options-general.php' )
				),
				'options_url'             => array(
					'general'    => getwid()->settingsPage()->getTabUrl( 'general' ),
					'appearance' => getwid()->settingsPage()->getTabUrl( 'appearance' ),
					'blocks'     => getwid()->settingsPage()->getTabUrl( 'blocks' ),
				),
				'nonces'                  => array(
					'google_api_key'        => wp_create_nonce( 'getwid_nonce_google_api_key' ),
					'recaptcha_v2'          => wp_create_nonce( 'getwid_nonce_recaptcha_v2' ),
					'mailchimp_api_key'     => wp_create_nonce( 'getwid_nonce_mailchimp_api_key' ),
					'check_instagram_token' => wp_create_nonce( 'getwid_nonce_check_instagram_token' ),
				),
				'acf_exist'               => getwid_acf_is_active(),
				'current_user'            => array(
					'can_manage_options' => $current_user_can_manage_options,
				),
			)
		);

		wp_add_inline_script( 'wp-blocks', 'const Getwid = ' . wp_json_encode( $data ), 'before' );
	}

	public function get_image_sizes() {

		global $_wp_additional_image_sizes;

		$intermediate_image_sizes = get_intermediate_image_sizes();

		$image_sizes = array();
		foreach ( $intermediate_image_sizes as $size ) {
			if ( isset( $_wp_additional_image_sizes[ $size ] ) ) {
				$image_sizes[ $size ] = array(
					'width'  => $_wp_additional_image_sizes[ $size ]['width'],
					'height' => $_wp_additional_image_sizes[ $size ]['height'],
				);
			} else {
				$image_sizes[ $size ] = array(
					'width'  => intval( get_option( "{$size}_size_w" ) ),
					'height' => intval( get_option( "{$size}_size_h" ) ),
				);
			}
		}

		$sizes_arr = array();
		foreach ( $image_sizes as $key => $value ) {
			$temp_arr          = array();
			$temp_arr['value'] = $key;
			$temp_arr['label'] = ucwords( strtolower( preg_replace( '/[-_]/', ' ', $key ) ) ) . " - {$value['width']} x {$value['height']}";
			$sizes_arr[]       = $temp_arr;
		}

		$sizes_arr[] = array(
			'value' => 'full',
			'label' => __( 'Full Size', 'getwid' ),
		);

		return $sizes_arr;
	}

	/**
	 * Enqueue editor-only js and css (Enqueue scripts (only on Edit Post Page))
	 */
	public function enqueueEditorAssets() {

		global $pagenow;

		$dependencies = array( 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-api', 'wp-api-fetch', 'lodash' );

		if ( $pagenow && $pagenow === 'widgets.php' ) {
			array_push( $dependencies, 'wp-edit-widgets' );
		} else {
			array_push( $dependencies, 'wp-editor' );
		}

		// Enqueue the bundled block JS file
		wp_enqueue_script(
			"{$this->prefix}-blocks-editor-js",
			getwid_get_plugin_url( 'assets/js/editor.blocks.js' ),
			apply_filters(
				'getwid/editor_blocks_js/dependencies',
				$dependencies
			),
			$this->version,
			true
		);

		//disabled blocks
		$disabledBlocks     = array();
		$disabledBlocksData = array();
		if ( getwid()->blocksManager()->hasDisabledBlocks() ) {
			$disabledBlocks = getwid()->blocksManager()->getDisabledBlocks();
			foreach ( $disabledBlocks as $block ) {
				$disabledBlocksData[] = $block->getBlockName();
			}
		}

		$current_user_can_manage_options = current_user_can( 'manage_options' );

		$mailchimp_api_key = get_option( 'getwid_mailchimp_api_key', '' );

		if ( ! $current_user_can_manage_options ) {
			$mailchimp_api_key = $mailchimp_api_key ? '1' : '';
		}

		$recaptcha_site_key   = $current_user_can_manage_options ? get_option( 'getwid_recaptcha_v2_site_key', '' ) : '1';
		$recaptcha_secret_key = $current_user_can_manage_options ? get_option( 'getwid_recaptcha_v2_secret_key', '' ) : '1';

		wp_localize_script(
			"{$this->prefix}-blocks-editor-js",
			'Getwid',
			apply_filters(
				'getwid/editor_blocks_js/localize_data',
				array(
					'disabled_blocks'         => $disabledBlocksData,
					'settings'                => array(
						'wide_support'          => get_theme_support( 'align-wide' ),
						'date_time_utc'         => current_time( 'Y-m-d H:i:s' ),
						'post_type'             => get_post_type(),
						'google_api_key'        => get_option( 'getwid_google_api_key', '' ),
						'instagram_token_isset' => (bool) get_option( 'getwid_instagram_token', '' ),

						'assets_path'           => getwid_get_plugin_url( '/assets' ),
						'image_sizes'           => $this->get_image_sizes(),

						'excerpt_length'        => apply_filters( 'excerpt_length', 55 ),
						'recaptcha_site_key'    => $recaptcha_site_key,
						'recaptcha_secret_key'  => $recaptcha_secret_key,
						'mailchimp_api_key'     => $mailchimp_api_key,
						'debug'                 => ( defined( 'WP_DEBUG' ) ? WP_DEBUG : false ),
					),
					'templates'               => array(
						'name' => getwid()->postTemplatePart()->postType,
						'new'  => admin_url( 'post-new.php?post_type=' . getwid()->postTemplatePart()->postType ),
						'view' => admin_url( 'edit.php?post_type=' . getwid()->postTemplatePart()->postType ),
						'edit' => admin_url( 'post.php?post=' ),
					),
					'ajax_url'                => admin_url( 'admin-ajax.php' ),
					'options_general_url'     => admin_url( 'options-general.php' ),
					'get_instagram_token_url' => add_query_arg(
						array( 'nonce' => wp_create_nonce( 'getwid_nonce_save_instagram_token' ) ),
						admin_url( 'options-general.php' )
					),
					'options_url'             => array(
						'general'    => getwid()->settingsPage()->getTabUrl( 'general' ),
						'appearance' => getwid()->settingsPage()->getTabUrl( 'appearance' ),
						'blocks'     => getwid()->settingsPage()->getTabUrl( 'blocks' ),
					),
					'nonces'                  => array(
						'google_api_key'        => wp_create_nonce( 'getwid_nonce_google_api_key' ),
						'recaptcha_v2'          => wp_create_nonce( 'getwid_nonce_recaptcha_v2' ),
						'mailchimp_api_key'     => wp_create_nonce( 'getwid_nonce_mailchimp_api_key' ),
						'check_instagram_token' => wp_create_nonce( 'getwid_nonce_check_instagram_token' ),
					),
					'acf_exist'               => getwid_acf_is_active(),
					'current_user'            => array(
						'can_manage_options' => $current_user_can_manage_options,
					),
				)
			)
		);

		wp_set_script_translations( "{$this->prefix}-blocks-editor-js", 'getwid' );

		$rtl = is_rtl() ? '.rtl' : '';
		// Enqueue optional editor only styles
		wp_enqueue_style(
			"{$this->prefix}-blocks-editor",
			getwid_get_plugin_url( 'assets/css/blocks.editor' . $rtl . '.css' ),
			apply_filters(
				'getwid/editor_blocks_css/dependencies',
				array()
			),
			$this->version
		);
	}

	public function enqueue_editor_section_css() {
		add_editor_style( getwid_generate_section_content_width_css() );
	}
}
