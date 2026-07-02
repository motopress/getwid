<?php

namespace Getwid\Blocks\New;

class Mailchimp extends AbstractBlock {

	private $mailchimp;

	public function __construct() {

		parent::__construct( 'getwid/mailchimp' );

		add_action( 'wp_ajax_getwid_mailchimp_api_key_manage', array( $this, 'mailchimp_api_key_manage' ) );
		add_action( 'wp_ajax_getwid_subscribe', array( $this, 'subscribe' ) );
		add_action( 'wp_ajax_nopriv_getwid_subscribe', array( $this, 'subscribe' ) );

		$this->register_mailchimp_blocks();
	}

	public function get_label() {
		return __( 'Mailchimp', 'getwid' );
	}

	private function register_mailchimp_blocks() {

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/mailchimp' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/mailchimp-field-email' ),
			array(
				'render_callback' => array( $this, 'render_mailchimp_field_email' ),
			)
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/mailchimp-field-first-name' ),
			array(
				'render_callback' => array( $this, 'render_mailchimp_field_first_name' ),
			)
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/mailchimp-field-last-name' ),
			array(
				'render_callback' => array( $this, 'render_mailchimp_field_last_name' ),
			)
		);
	}

	public function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		$inline_script  = 'var Getwid = Getwid || {};';
		$inline_script .= 'Getwid["ajax_url"] = ' . wp_json_encode( admin_url( 'admin-ajax.php' ) ) . ';';

		wp_add_inline_script(
			'getwid-mailchimp-view-script',
			$inline_script,
			'before'
		);
	}

	public function render_callback( $attributes, $content ) {

		$class      = 'wp-block-getwid-mailchimp';
		$block_name = 'wp-block-getwid-mailchimp';

		if ( isset( $attributes['className'] ) ) {
			$class .= ' ' . $attributes['className'];
		}

		if ( isset( $attributes['align'] ) ) {
			$class .= ' align' . $attributes['align'];
		}

		$button_style = '';
		$button_class = '';

		getwid_custom_color_style_and_class( $button_style, $button_class, $attributes, 'color' );
		getwid_custom_color_style_and_class( $button_style, $button_class, $attributes, 'background' );

		$extra_attr = array(
			'class'        => $class,
			'block_name'   => $block_name,
			'content'      => $content,
			'button_style' => $button_style,
			'button_class' => $button_class,
		);

		ob_start();
		?>
		<div class="<?php echo esc_attr( $class ); ?>">
			<?php getwid_get_template_part( 'mailchimp/mailchimp', $attributes, false, $extra_attr ); ?>
		</div>
		<?php

		$result = ob_get_clean();

		$this->block_frontend_assets();

		return $result;
	}

	public function render_mailchimp_field_email( $attributes ) {
		ob_start();
		getwid_get_template_part( 'mailchimp/field-email', $attributes, false );

		return ob_get_clean();
	}

	public function render_mailchimp_field_first_name( $attributes ) {
		$extra_attr = array( 'name' => 'first_name' );

		if ( ! isset( $attributes['label'] ) ) {
			$attributes['label'] = __( 'First name', 'getwid' );
		}

		ob_start();
		getwid_get_template_part( 'mailchimp/field-first-name', $attributes, false, $extra_attr );

		return ob_get_clean();
	}

	public function render_mailchimp_field_last_name( $attributes ) {
		$extra_attr = array( 'name' => 'last_name' );

		if ( ! isset( $attributes['label'] ) ) {
			$attributes['label'] = __( 'Last name', 'getwid' );
		}

		ob_start();
		getwid_get_template_part( 'mailchimp/field-last-name', $attributes, false, $extra_attr );

		return ob_get_clean();
	}

	public function mailchimp_api_key_manage() {
		$nonce = sanitize_key( $_POST['nonce'] );

		if ( ! wp_verify_nonce( $nonce, 'getwid_nonce_mailchimp_api_key' ) ) {
			wp_send_json_error();
		}

		$option = sanitize_text_field( wp_unslash( $_POST['option'] ) );

		if ( ! current_user_can( 'manage_options' ) && ! in_array( $option, array( 'sync', 'load' ), true ) ) {
			wp_send_json_error( esc_html__( 'You are not allowed to perform this action. Please contact the administrator.', 'getwid' ) );
		}

		switch ( $option ) {
			case 'save':
				$api_key = sanitize_text_field( wp_unslash( $_POST['data']['api_key'] ) );
				update_option( 'getwid_mailchimp_api_key', $api_key );
				break;
			case 'delete':
				delete_option( 'getwid_mailchimp_api_key' );
				delete_option( 'audiences_list_chash' );
				wp_send_json_success();
				return;
		}

		if ( ! isset( $api_key ) ) {
			$api_key = get_option( 'getwid_mailchimp_api_key', '' );
		}

		if ( ! empty( $api_key ) ) {
			try {
				$this->mailchimp = new \DrewM\MailChimp\MailChimp( $api_key );
			} catch ( \Exception $exception ) {
				wp_send_json_error( $exception->getMessage() );
			}

			$maybe_cached = $this->get_account_subscribe_lists( 'sync' === $option );

			wp_send_json_success( $maybe_cached );
		}
	}

	public function get_lists() {

		$response = $this->mailchimp->get( 'lists' );

		if ( $this->mailchimp->success() ) {
			if ( isset( $response['lists'] ) ) {
				$response = array_map(
					function ( $item ) {
						return array(
							'id'    => $item['id'],
							'title' => $item['name'],
						);
					},
					$response['lists']
				);
			}
		} else {
			$error = $this->mailchimp->getLastError();
			wp_send_json_error( $error );
		}

		return $response;
	}

	public function get_account_subscribe_lists( $sync = false ) {

		if ( ! $sync ) {
			$cache = get_option( 'audiences_list_chash' );
		}

		if ( $sync || empty( $cache ) ) {
			$cache = array();

			$list = $this->get_lists();

			if ( count( $list ) > 0 ) {
				$cache = $list;

				foreach ( $list as $key => $list_item ) {
					$categories = $this->get_interest_categories( $list_item['id'] );

					$cache[ $key ]['categories'] = $categories;
					foreach ( $cache[ $key ]['categories'] as $k => $category_item ) {
						$interests                                      = $this->get_interests( $list_item['id'], $category_item['id'] );
						$cache[ $key ]['categories'][ $k ]['interests'] = $interests;
					}
				}
			}

			if ( ! empty( $cache ) ) {
				update_option( 'audiences_list_chash', $cache );
			}
		}

		return $cache;
	}

	private function get_interest_categories( $list_id ) {
		$response = $this->mailchimp->get( "lists/{$list_id}/interest-categories" );

		if ( $this->mailchimp->success() ) {
			if ( isset( $response['categories'] ) ) {
				$response = array_map(
					function ( $item ) {
						return array(
							'id'    => $item['id'],
							'title' => $item['title'],
						);
					},
					$response['categories']
				);
			}
		} else {
			$error = $this->mailchimp->getLastError();
			wp_send_json_error( $error );
		}

		return $response;
	}

	private function get_interests( $list_id, $category_id ) {
		$response = $this->mailchimp->get( "lists/{$list_id}/interest-categories/{$category_id}/interests" );

		if ( $this->mailchimp->success() ) {
			if ( isset( $response['interests'] ) ) {
				$response = array_map(
					function ( $item ) {
						return array(
							'id'    => $item['id'],
							'title' => $item['name'],
						);
					},
					$response['interests']
				);
			}
		} else {
			$error = $this->mailchimp->getLastError();
			wp_send_json_error( $error );
		}

		return $response;
	}

	public function subscribe() {

		$email = ! empty( $_POST['data']['email'] ) ? sanitize_email( wp_unslash( $_POST['data']['email'] ) ) : '';

		if ( empty( $email ) || ! is_email( $email ) ) {
			wp_send_json_error( __( 'Email is required.', 'getwid' ) );
		}

		if ( empty( $_POST['data']['list_ids'] ) ) {
			wp_send_json_error( __( 'An invalid Mailchimp list was provided.', 'getwid' ) );
		}

		$interests_ids = json_decode( sanitize_text_field( wp_unslash( $_POST['data']['list_ids'] ) ), true );

		$merge_vars                  = array();
		$merge_vars['email_address'] = $email;
		$merge_vars['status']        = 'subscribed';

		$merge_vars['merge_fields'] = array();
		if ( isset( $_POST['data']['first-name'] ) ) {
			$merge_vars['merge_fields']['FNAME'] = sanitize_text_field( wp_unslash( $_POST['data']['first-name'] ) );
		}

		if ( isset( $_POST['data']['last-name'] ) ) {
			$merge_vars['merge_fields']['LNAME'] = sanitize_text_field( wp_unslash( $_POST['data']['last-name'] ) );
		}

		if ( empty( $merge_vars['merge_fields'] ) ) {
			unset( $merge_vars['merge_fields'] );
		}

		$merge_vars['interests'] = array();
		foreach ( $interests_ids as $list ) {
			$list = explode( '/', $list );

			list( $first, $second ) = $list;
			if ( isset( $second ) ) {
				$merge_vars['interests'][ $second ] = true;
			}
		}

		if ( empty( $merge_vars['interests'] ) ) {
			unset( $merge_vars['interests'] );
		}

		if ( ! strpos( $interests_ids[0], '/' ) ) {
			list( $list_id ) = $interests_ids;
		} else {
			$interest        = explode( '/', $interests_ids[0] );
			list( $list_id ) = $interest;
		}

		$api_key = get_option( 'getwid_mailchimp_api_key' );

		try {
			$this->mailchimp = new \DrewM\MailChimp\MailChimp( $api_key );
		} catch ( \Exception $exception ) {
			wp_send_json_error( $exception->getMessage() );
		}

		$subscriber_hash = \DrewM\MailChimp\MailChimp::subscriberHash( $email );
		$response        = $this->mailchimp->put( "lists/$list_id/members/$subscriber_hash", $merge_vars );

		if ( $this->mailchimp->success() ) {
			wp_send_json_success(
				__( 'Thank you for joining our mailing list.', 'getwid' )
			);
		} else {
			$error = $this->mailchimp->getLastError();
			wp_send_json_error( $error );
		}
	}
}

getwid()->blocksManager()->addBlock(
	new Mailchimp()
);
