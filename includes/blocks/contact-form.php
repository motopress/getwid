<?php

namespace Getwid\Blocks;

class ContactForm extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/contact-form';

    public function __construct() {

        parent::__construct( self::$blockName );

		add_action( 'wp_ajax_getwid_update_recaptcha_credentials', [ $this, 'update_recaptcha_credentials' ] );

        add_action( 'wp_ajax_getwid_send_mail', [ $this, 'send' ] );
        add_action( 'wp_ajax_nopriv_getwid_send_mail', [ $this, 'send' ] );

        $this->register_contact_form_blocks();
    }

	public function getLabel() {
		return __('Contact Form', 'getwid');
	}

    private function register_contact_form_blocks() {

        /* #region register all blocks */
        register_block_type(
            'getwid/contact-form',
            array(
                'render_callback' => [ $this, 'render_callback' ]
            )
		);

		$field_name = 'getwid/field-name';
        register_block_type(
            $field_name,
            array(
                'render_callback' => [ $this, 'render_field_name_block' ]
            )
		);

		$field_email = 'getwid/field-email';
        register_block_type(
            $field_email,
            array(
                'render_callback' => [ $this, 'render_field_email_block' ]
            )
		);

		$field_textarea = 'getwid/field-textarea';
        register_block_type(
            $field_textarea,
            array(
                'render_callback' => [ $this, 'render_field_textarea_block' ]
            )
        );
        /* #endregion */
    }

    /* #region render inner blocks methods */
    public function render_field_name_block( $attributes ) {
        ob_start();?>
        <?php getwid_get_template_part( 'contact-form/field-name', $attributes, false ); ?><?php

        $result = ob_get_clean();
        return $result;
    }

    public function render_field_email_block( $attributes ) {
        ob_start();?>
        <?php getwid_get_template_part( 'contact-form/field-email', $attributes, false ); ?><?php

        $result = ob_get_clean();
        return $result;
    }

    public function render_field_textarea_block( $attributes ) {
        ob_start();?>
        <?php getwid_get_template_part( 'contact-form/field-textarea', $attributes, false ); ?><?php

        $result = ob_get_clean();
        return $result;
    }

    public function render_captcha_block( $attributes ) {

        $site_key = get_option( 'getwid_recaptcha_v2_site_key', '' );

        $extra_attr = array(
            'site_key' => $site_key
        );

        $result = '';
        if ( $site_key ) {

            wp_enqueue_script( 'recaptcha', 'https://www.google.com/recaptcha/api.js?render=explicit' );

            ob_start();?>
            <?php getwid_get_template_part( 'contact-form/captcha', $attributes, false, $extra_attr ); ?><?php

            $result = ob_get_clean();
        }

        return $result;
    }
    /* #endregion */

    public function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		if ( FALSE == getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		$rtl = is_rtl() ? '.rtl' : '';

		wp_enqueue_style(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/contact-form/style' . $rtl . '.css' ),
			[],
			getwid()->settings()->getVersion()
		);

		wp_enqueue_script(
            self::$blockName,
            getwid_get_plugin_url( 'assets/blocks/contact-form/frontend.js' ),
            [ 'jquery' ],
            getwid()->settings()->getVersion(),
            true
        );

		$inline_script =
			'var Getwid = Getwid || {};' .
			'Getwid["ajax_url"] = ' . json_encode( admin_url( 'admin-ajax.php' ) ) . ';' .
			'Getwid["nonces"] = ' . json_encode(
				array( 'contact_form' => wp_create_nonce( 'getwid_nonce_send_contact_form' ) )
			) . ';'
		;

		wp_add_inline_script(
			self::$blockName,
			$inline_script,
			'before'
		);

    }

    public function render_callback( $attributes, $content ) {

        $class = 'wp-block-getwid-contact-form';
        $block_name = $class;

        if ( isset( $attributes[ 'className' ] ) ) {
            $class .= ' ' . $attributes[ 'className' ];
        }

        if ( isset( $attributes[ 'align' ] ) ) {
            $class .= ' align' . $attributes[ 'align' ];
        }

        $button_style = '';
        $button_class = '';

        getwid_custom_color_style_and_class( $button_style, $button_class, $attributes, 'color'      );
        getwid_custom_color_style_and_class( $button_style, $button_class, $attributes, 'background' );

		$recaptcha_theme = isset( $attributes['recaptchaTheme'] ) ? $attributes['recaptchaTheme'] : '';
		$captcha = $this->render_captcha_block( [ 'theme' =>  $recaptcha_theme ] );

        $extra_attr = array(
            'class' => $class,
            'block_name' => $block_name,
            'content'    => $content . $captcha,

            'button_style' => $button_style,
            'button_class' => $button_class
        );

        ob_start();?>
        <div class="<?php echo esc_attr( $class ); ?>" >
            <?php getwid_get_template_part( 'contact-form/contact-form', $attributes, false, $extra_attr ); ?>
        </div><?php

        $result = ob_get_clean();

		$this->block_frontend_assets();

        return $result;
    }

    public function send() {

        check_ajax_referer( 'getwid_nonce_send_contact_form', 'nonce' );

		$recaptcha_secret_key = get_option( 'getwid_recaptcha_v2_secret_key', false );

        if ( $recaptcha_secret_key ) {

			if ( empty( $_POST['data']['g-recaptcha-response'] ) ) {
				wp_send_json_error( $this->get_error( 'bad-request' ) );
			}

			$recaptcha_challenge  = sanitize_text_field( wp_unslash( $_POST['data']['g-recaptcha-response'] ) );

            $request = wp_remote_get(
                'https://google.com/recaptcha/api/siteverify?secret=' . $recaptcha_secret_key . '&response=' . $recaptcha_challenge,
                array( 'timeout' => 15 )
            );

            $response = json_decode( wp_remote_retrieve_body( $request ), false );

            $errors = '';
            if ( ! $response->{ 'success' } ) {
                foreach ( $response->{ 'error-codes' } as $index => $value ) {
                    $errors .= $this->get_error( $value );
                }
                wp_send_json_error( $errors );
            } else {
                $this->send_mail( $_POST['data'] );
            }

        } else {
			$this->send_mail( $_POST['data'] );
		}
    }

    private function send_mail( $data ) {

        $default_recipient = get_option( 'admin_email' );
        $recipient = get_option( 'getwid_contact_form_recipient_email', '' );
        $to = $recipient != '' ? $recipient : $default_recipient;

        $subject = esc_html__( 'Contact Form', 'getwid' );

        if ( ! empty( $data['subject'] ) ) {
            $subject = sprintf(
                //translators: %s is email subject
                esc_html__( 'Contact Form: %s', 'getwid' ),
                sanitize_text_field( wp_unslash( $data[ 'subject' ] ) )
            );
        }

        $email   = sanitize_email( wp_unslash( $data[ 'email' ] ) );
        $name    = sanitize_text_field( wp_unslash( $data[ 'name' ] ) );
        $message[] = sanitize_textarea_field( wp_unslash( $data[ 'message' ] ) );
        $message[] = '<br/><br/>';
        $message[] = '<hr/>';
        $message[] = sprintf(
            //translators: %s is a blogname
            __( 'This e-mail was sent from a contact form on %s', 'getwid' ),
            get_option( 'blogname' )
        );

        $body = implode( '', $message );

        if ( $email ) {
            $headers = array( 'Reply-To: ' . $name . ' <' . $email . '>' );
        }

        $response = getwid()->mailer()->send( $to, $subject, $body, $headers );

        if ( $response ) {
            wp_send_json_success(
                __( 'Thank you for your message. It has been sent.',
                'getwid'
            ) );
            return;
        }

        wp_send_json_error(
            __('There was an error trying to send your message. Please try again later.', 'getwid')
        );
    }

    public function update_recaptcha_credentials() {

		check_ajax_referer( 'getwid_nonce_recaptcha_v2', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error();
        }

        $site_key = sanitize_text_field( wp_unslash( $_POST['data']['site_key'] ) );
        $secret_key = sanitize_text_field( wp_unslash( $_POST['data']['secret_key'] ) );

		if ( ! empty( $site_key ) ) {
			update_option( 'getwid_recaptcha_v2_site_key', $site_key );
		} else {
			delete_option( 'getwid_recaptcha_v2_site_key' );
		}

		if ( ! empty( $secret_key ) ) {
			update_option( 'getwid_recaptcha_v2_secret_key', $secret_key );
		} else {
			delete_option( 'getwid_recaptcha_v2_secret_key' );
		}

        wp_send_json_success();
    }

    private function get_error( $error_code ) {
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
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\ContactForm()
);
