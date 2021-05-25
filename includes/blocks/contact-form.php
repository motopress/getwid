<?php

namespace Getwid\Blocks;

class ContactForm extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/contact-form';

    public function __construct() {

        parent::__construct( self::$blockName );

		add_action( 'wp_ajax_getwid_recaptcha_api_key_manage', [ $this, 'recaptcha_api_key_manage' ] );

        add_action( 'wp_ajax_getwid_send_mail'		 , [ $this, 'send' ] );
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

		$field_captcha = 'getwid/captcha';
        register_block_type(
            $field_captcha,
            array(
                'render_callback' => [ $this, 'render_captcha_block' ]
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

            wp_enqueue_script( 'recaptcha', 'https://www.google.com/recaptcha/api.js?render=explicit&hl=en' );

            ob_start();?>
            <?php getwid_get_template_part( 'contact-form/captcha', $attributes, false, $extra_attr ); ?><?php

            $result = ob_get_clean();
        }

        return $result;
    }
    /* #endregion */

    private function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		if ( FALSE == getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		wp_enqueue_style(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/contact-form/style.css' ),
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

		/*
		 * var Getwid = {"ajax_url":"https:\/\/getwid.loc\/wp-admin\/admin-ajax.php","nonces":{"recaptcha_v2_contact_form":"6fea8c6c3e"}};
		 */
		$inline_script =
			'var Getwid = Getwid || {};' .
			'Getwid["ajax_url"] = ' . json_encode( admin_url( 'admin-ajax.php' ) ) . ';' .
			'Getwid["nonces"] = ' . json_encode(
				array( 'recaptcha_v2_contact_form' => wp_create_nonce( 'getwid_nonce_contact_form' ) )
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
            $class .= ' ' . esc_attr( $attributes[ 'className' ] );
        }

        if ( isset( $attributes[ 'align' ] ) ) {
            $class .= ' align' . esc_attr( $attributes[ 'align' ] );
        }

        $button_style = '';
        $button_class = '';

        getwid_custom_color_style_and_class( $button_style, $button_class, $attributes, 'color'      );
        getwid_custom_color_style_and_class( $button_style, $button_class, $attributes, 'background' );

        $extra_attr = array(
            'class' => $class,
            'block_name' => $block_name,
            'content'    => $content,

            'button_style' => $button_style,
            'button_class' => $button_class
        );

        ob_start();?>
        <div class='<?php echo esc_attr( $class ); ?>'>
            <?php getwid_get_template_part( 'contact-form/contact-form', $attributes, false, $extra_attr ); ?>
        </div><?php

        $result = ob_get_clean();

		$this->block_frontend_assets();

        return $result;
    }

    public function send() {

        check_ajax_referer( 'getwid_nonce_contact_form', 'security' );

        $data = array();
        parse_str( $_POST['data'], $data );

        if ( !isset( $data['g-recaptcha-response'] ) ) {
            $this->send_mail( $data );
        } else {
            $recaptcha_challenge  = $data['g-recaptcha-response'];
            $recaptcha_secret_key = get_option('getwid_recaptcha_v2_secret_key');

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
                $this->send_mail( $data );
            }
        }
    }

    private function send_mail( $data ) {

        $to = get_option( 'admin_email' );

        $subject = sprintf(
			//translators: %s is a blogname
			__( 'This e-mail was sent from a contact form on %s', 'getwid' ),
			get_option( 'blogname' )
		);

		if ( ! empty( $data['subject'] ) ) {
			$subject = trim( $data[ 'subject' ] );
		}

        $email   = trim( $data[ 'email' ] );
        $name    = stripslashes( $data[ 'name' ] );
        $message = stripslashes( $data[ 'message' ] );
        $body = $message;

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

    public function recaptcha_api_key_manage() {
        $nonce = $_POST[ 'nonce' ];

        if ( ! wp_verify_nonce( $nonce, 'getwid_nonce_contact_form' ) ) {
            wp_send_json_error();
        }

        $data   = $_POST['data'];
        $option = $_POST['option'];

        $site_api_key   = trim( $data['site_api_key'] );
        $secret_api_key = trim( $data['secret_api_key'] );

        $response = false;
        if ( $option == 'set' ) {
            if ( ! empty( $site_api_key ) ) {
                $response = update_option( 'getwid_recaptcha_v2_site_key', $site_api_key );
            }
            if ( ! empty( $secret_api_key ) ) {
                $response = update_option( 'getwid_recaptcha_v2_secret_key', $secret_api_key );
            }
        } elseif ( $option == 'delete' ) {
            $response = delete_option( 'getwid_recaptcha_v2_site_key' );
            $response = delete_option( 'getwid_recaptcha_v2_secret_key' );
        }

        wp_send_json_success( $response );
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
