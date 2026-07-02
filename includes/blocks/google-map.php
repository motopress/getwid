<?php

namespace Getwid\Blocks\New;

class GoogleMap extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/map' );

		add_action( 'wp_ajax_get_google_api_key', array( $this, 'get_google_api_key' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );

		getwid_maybe_add_option( 'getwid_google_api_key', '', true );

		$this->register_vendor_scripts();

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/map' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Google Maps', 'getwid' );
	}

	private function register_vendor_scripts() {

		wp_register_script(
			'getwid-map-styles',
			getwid_get_plugin_url( 'vendors/getwid/map-styles.min.js' ),
			array(),
			'1.0.0',
			true
		);
	}

	public function enqueue_editor_assets() {

		wp_enqueue_script( 'getwid-map-styles' );
	}

	public function get_google_api_key() {

		$nonce  = sanitize_key( $_POST['nonce'] );
		$action = sanitize_text_field( wp_unslash( $_POST['option'] ) );
		$data   = sanitize_text_field( wp_unslash( $_POST['data'] ) );

		if ( ! wp_verify_nonce( $nonce, 'getwid_nonce_google_api_key' ) ) {
			wp_send_json_error();
		}

		if ( ! current_user_can( 'manage_options' ) && in_array( $action, array( 'set', 'delete' ), true ) ) {
			wp_send_json_error( esc_html__( 'You are not allowed to perform this action. Please contact the administrator.', 'getwid' ) );
		}

		$response = false;
		if ( 'get' === $action ) {
			$response = get_option( 'getwid_google_api_key', '' );
		} elseif ( 'set' === $action ) {
			$response = update_option( 'getwid_google_api_key', $data );
		} elseif ( 'delete' === $action ) {
			$response = delete_option( 'getwid_google_api_key' );
		}

		wp_send_json_success( $response );
	}

	public function block_frontend_assets( $content = '' ) {

		if ( is_admin() ) {
			return;
		}

		$has_preset_style = (
			false === strpos( $content, 'data-map-style="default"' ) &&
			false === strpos( $content, 'data-map-style="custom"' )
		);

		if ( $has_preset_style && ! wp_script_is( 'getwid-map-styles', 'enqueued' ) ) {
			wp_enqueue_script( 'getwid-map-styles' );
		}

		$api_key = get_option( 'getwid_google_api_key', '' );

		if ( $api_key ) {
			wp_enqueue_script(
				'google_api_key_js',
				'https://maps.googleapis.com/maps/api/js?key=' . rawurlencode( $api_key ),
				array(),
				null,
				true
			);
		}

		if ( false === getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		add_filter(
			'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );
	}

	public function render_callback( $attributes, $content ) {

		$this->block_frontend_assets( $content );

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new GoogleMap()
);
