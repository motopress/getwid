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
		add_action( 'wp_ajax_getwid_recaptcha_api_key', [ $this, 'getwid_recaptcha_api_key' ] );

		add_action( 'wp_ajax_getwid_instagram_token', [ $this, 'getwid_instagram_token' ] );
		add_action( 'wp_ajax_getwid_contact_form_send', [ $this, 'getwid_contact_form_send' ] );
		add_action( 'wp_ajax_nopriv_getwid_contact_form_send', [ $this, 'getwid_contact_form_send' ] );

		add_action( 'after_theme_setup', [ $this, 'getwid_enqueue_editor_section_css' ] );
	}

	public function getwid_instagram_token() {
		$action = $_POST['option'];
		$data = $_POST['data'];

		$response = false;
		if ($action == 'get') {
			$response = get_option( 'getwid_instagram_token', '' );
		}

		wp_send_json_success( $response );
	}

	public function getwid_contact_form_send() {
	
		check_ajax_referer( 'getwid_nonce_contact_form', 'security' );

		$data = array();
		parse_str($_POST['data'], $data);

		if ( !isset( $data['g-recaptcha-response'] ) ) {
			$this->getwid_contact_form_send_mail( $data );
		} else {
			$recaptcha_challenge  = $data['g-recaptcha-response'];
			$recaptcha_secret_key = get_option('getwid_recaptcha_v2_secret_key');

			$request = wp_remote_get(
				'https://google.com/recaptcha/api/siteverify?secret=' . $recaptcha_secret_key . '&response=' . $recaptcha_challenge,
				array( 'timeout' => 15 )
			);

			$response = json_decode( wp_remote_retrieve_body( $request ) );

			$errors = '';
			if ( !$response->{ 'success' } ) {
				foreach ( $response->{ 'error-codes' } as $index => $value ) {
					$errors .= $this->getwid_contact_form_get_error( $value );
				}
				wp_send_json_error( $errors );
			} else {
				$this->getwid_contact_form_send_mail( $data );
			}
		}		
	}

	public function getwid_contact_form_send_mail( $data ) {

		$to      = get_option( 'admin_email' );
		$subject = empty( $data['subject'] ) ? sprintf( __('This e-mail was sent from a contact form on %s', 'getwid'), get_option('blogname') ) : trim( $data['subject'] );

		$email   = trim( $data['email'] );
		$name    = stripslashes( $data['name'] );
		$message = stripslashes( $data['message'] );
		$body = $message;

		if ( $email ) {
			$headers = array( 'Reply-To: ' . $name . ' <' . $email . '>' );
		}

		$response = getwid()->getMailer()->send( $to, $subject, $body, $headers );

		if ( $response ) {
			wp_send_json_success(
				__( 'Thank you for your message. It has been sent.',
				'getwid'
			) );
			return;
		}

		wp_send_json_error(
			__('There was an error trying to send your message. Please try again later.','getwid')
		);
	}

	public function getwid_contact_form_get_error( $error_code ) {
		switch ( $error_code ) {
			case 'bad-request':
				return __( 'The request is invalid or malformed.',
					'getwid'
				);
				break;

			case 'missing-input-secret':
				return __( 'The secret parameter is missing.',
					'getwid'
				);
				break;

			case 'missing-input-response':
				return __( 'Please check the captcha.',
					'getwid'
				);
				break;

			case 'invalid-input-secret':
				return __( 'The secret parameter is invalid or malformed.',
					'getwid'
				);
				break;

			case 'invalid-input-response':
				return __( 'The response parameter is invalid or malformed.',
					'getwid'
				);
				break;

			case 'timeout-or-duplicate':
				return __( 'The response is no longer valid: either is too old or has been used previously.',
					'getwid'
				);
				break;
			default:
				return;
		}
	}

	public function getwid_google_api_key() {
		$action = $_POST['option'];
		$data = $_POST['data'];
		$nonce = $_POST['nonce'];

		if ( ! wp_verify_nonce( $nonce, 'getwid_nonce_google_api_key' ) ) {
			wp_send_json_error();
		}

		$response = false;
		if ($action == 'get') {
			$response = get_option( 'getwid_google_api_key', '');
		} elseif ($action == 'set') {
			$response = update_option( 'getwid_google_api_key', $data );
		} elseif ($action == 'delete') {
			$response = delete_option( 'getwid_google_api_key');
		}

		wp_send_json_success( $response );
	}

	public function getwid_recaptcha_api_key() {
		$nonce = $_POST['nonce'];

		if ( ! wp_verify_nonce( $nonce, 'getwid_nonce_contact_form' ) ) {
			wp_send_json_error();
		}

		$data   = $_POST['data'  ];
		$option = $_POST['option'];
		
		$site_api_key   = $data['site_api_key'  ];
		$secret_api_key = $data['secret_api_key'];		

		$response = false;
		if ( $option == 'set' ) {
			if ( !empty( $site_api_key ) ) {
				$response = update_option( 'getwid_recaptcha_v2_site_key', $site_api_key );				
			}
			if ( !empty( $secret_api_key ) ) {
				$response = update_option( 'getwid_recaptcha_v2_secret_key', $secret_api_key );				
			}
		} elseif ( $option == 'delete' ) {
			$response = delete_option( 'getwid_recaptcha_v2_site_key'  );
			$response = delete_option( 'getwid_recaptcha_v2_secret_key');
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
			'magnific-popup',
			getwid_get_plugin_url( 'vendors/magnific-popup/jquery.magnific-popup.min.js' ),
			[ 'jquery' ],
			'1.1.0',
			true
		);
		
		wp_enqueue_script(
			'slick',
			getwid_get_plugin_url( 'vendors/slick/slick/slick.min.js' ),
			[ 'jquery' ],
			'1.9.0',
			true
		);

		wp_enqueue_script(
			'wow',
			getwid_get_plugin_url( 'vendors/wow.js/dist/wow.min.js' ),
			[ 'jquery' ],
			'1.2.1',
			true
		);

		wp_enqueue_script(
			'countup',
			getwid_get_plugin_url( 'vendors/countup.js/dist/countUp.min.js' ),
			[],
			'2.0.4',
			true
		);

		wp_enqueue_script(
			'waypoints',
			getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
			[ 'jquery' ],
			'4.0.1',
			true
		);

		//Styles
		wp_enqueue_style(
			'magnific-popup',
			getwid_get_plugin_url( 'vendors/magnific-popup/magnific-popup.css' ),
			[],
			'1.1.0'
		);

		wp_enqueue_style(
			'slick',
			getwid_get_plugin_url( 'vendors/slick/slick/slick.min.css' ),
			[],
			'1.9.0'
		);

		wp_enqueue_style(
			'slick-theme',
			getwid_get_plugin_url( 'vendors/slick/slick/slick-theme.min.css' ),
			[],
			'1.9.0'
		);

		wp_enqueue_style(
			'animate',
			getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
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
				'imagesloaded',
				'slick',
				'wow',
				'countup',
				'waypoints',
				'jquery-ui-tabs',
				'jquery-ui-accordion',
			],
			$this->version,
			true
		);

		wp_localize_script(
			"{$this->prefix}-blocks-editor-js",
			'Getwid',			
			apply_filters(
				'getwid/editor_blocks_js/localize_data',
				[
					'localeData' => $this->getwid_locale_data( 'getwid' ),					
					'settings' => [
						'post_type' => get_post_type(),
						'google_api_key'  => get_option('getwid_google_api_key', '' ),
						'instagram_token' => get_option('getwid_instagram_token', ''),						
						'assets_path' => getwid_get_plugin_url('/assets'),
						'image_sizes' => $this->getwid_get_image_sizes(),
						'excerpt_length' => apply_filters( 'excerpt_length', 55 ),
						'recaptcha_site_key' => get_option('getwid_recaptcha_v2_site_key', ''),
						'recaptcha_secret_key' => get_option('getwid_recaptcha_v2_secret_key', '')
					],
					'templates' => [
						'name' => PostTemplatePart::$postType,
						'new' => admin_url( 'post-new.php?post_type='.PostTemplatePart::$postType ),
						'view' => admin_url( 'edit.php?post_type='.PostTemplatePart::$postType ),				
						'edit' => admin_url( 'post.php?post=' ),				
					],
					'ajax_url' => admin_url( 'admin-ajax.php' ),
					'options_writing_url' => admin_url( 'options-writing.php' ),
					'nonces' => array(
						'google_api_key' => wp_create_nonce( 'getwid_nonce_google_api_key' ),
						'recaptcha_v2_contact_form' => wp_create_nonce( 'getwid_nonce_contact_form' )
					)
				]
			)
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
			"{$this->prefix}-blocks-editor",
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
			"{$this->prefix}-blocks",
			getwid_get_plugin_url( 'assets/css/blocks.style.css' ),
			apply_filters(
				'getwid/blocks_style_css/dependencies',
				[]
			),
			$this->version
		);

		wp_add_inline_style("{$this->prefix}-blocks", getwid_generate_section_content_width_css());
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
			apply_filters(
				'getwid/frontend_blocks_js/dependencies',
				[ 'slick', 'wow', 'jquery-ui-tabs', 'jquery-ui-accordion', 'lodash' ]
			),
			$this->version,
			true
		);

		wp_localize_script(
			"{$this->prefix}-blocks-frontend-js",
			'Getwid',
			apply_filters(
				'getwid/frontend_blocks_js/localize_data',
				[
					'settings'   => [
						'google_api_key' => get_option('getwid_google_api_key', '')
					],
					'ajax_url' => admin_url( 'admin-ajax.php' ),
					'nonces'   => array(
						'recaptcha_v2_contact_form' => wp_create_nonce( 'getwid_nonce_contact_form' )
					)
				]
			)
		);
	}

	function getwid_enqueue_editor_section_css() {
		add_editor_style(getwid_generate_section_content_width_css());
	}
}