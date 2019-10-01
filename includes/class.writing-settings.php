<?php

namespace Getwid;

class WritingSettings
{
    public function __construct()
    {
        $this->addActions();
    }

    protected function addActions()
    {
        add_action('admin_init', [$this, 'registerGroups']);
        add_action('admin_init', [$this, 'registerFields']);
        add_action('admin_init', [$this, 'checkInstagramQueryURL']);
    }


    public function getwid_instagram_notice_success() {
        ?>
        <div class="notice notice-success">
            <p><?php _e( 'Instagram: access token updated.', 'getwid' ); ?></p>
        </div>
        <?php
    }

    public function getwid_instagram_notice_error() {
        ?>
        <div class="notice notice-error">
            <p><?php _e('Instagram: access denied.', 'getwid'); ?></p>
        </div>
        <?php
    }

    public function checkInstagramQueryURL()
    {
        global $pagenow;
        if ($pagenow == 'options-writing.php' && isset($_GET['getwid-instagram-token'])) { 
            update_option('getwid_instagram_token', $_GET['getwid-instagram-token']);
            delete_transient( 'getwid_instagram_response_data' ); //Delete cache data
            wp_redirect( esc_url( add_query_arg( 'getwid-instagram-success', 'true', admin_url( 'options-writing.php' ) ) ) ); //Redirect
        }

        if (isset($_GET['getwid-instagram-success'])) {
            add_action( 'admin_notices', [$this, 'getwid_instagram_notice_success'] );
        }

        if (isset($_GET['getwid-instagram-error'])) {
            add_action( 'admin_notices', [$this, 'getwid_instagram_notice_error'] );
        }        
    }

    public function registerGroups()
    {
        $echoNothing = function () {};

        add_settings_section('getwid', __('Getwid', 'getwid'), $echoNothing, 'writing');
    }

    public function registerFields() {

        /* #region Section Content Width */
        add_settings_field( 'getwid_section_content_width', __( 'Section Content Width', 'getwid' ),
            [ $this, 'renderSectionContentWidth' ], 'writing', 'getwid' );
        register_setting( 'writing', 'getwid_section_content_width', [ 'type' => 'number', 'default' => '' ] );
        /* #endregion */

        /* #region Instagram Access Token */
        add_settings_field( 'getwid_instagram_token', __( 'Instagram Access Token', 'getwid' ),
            [ $this, 'renderInstagramToken' ], 'writing', 'getwid' );
        register_setting( 'writing', 'getwid_instagram_token', [ 'type' => 'text', 'default' => '' ] );
        /* #endregion */

        /* #region Google API Key */
        add_settings_field( 'getwid_google_api_key', __( 'Google Maps API Key', 'getwid' ),
            [ $this, 'renderGoogleApiKey' ], 'writing', 'getwid' );
        register_setting( 'writing', 'getwid_google_api_key', [ 'type' => 'text', 'default' => '' ] );
        /* #endregion */

        /* #region Recaptcha Site Key */
        add_settings_field( 'getwid_recaptcha_v2_site_key', __( 'Recaptcha Site Key', 'getwid' ),
            [ $this, 'renderRecaptchaSiteKey' ], 'writing', 'getwid' );
        register_setting( 'writing', 'getwid_recaptcha_v2_site_key', [ 'type' => 'text', 'default' => '' ] );
        /* #endregion */

        /* #region Recaptcha Secret Key */
        add_settings_field( 'getwid_recaptcha_v2_secret_key', __( 'Recaptcha Secret Key', 'getwid' ),
            [ $this, 'renderRecaptchaSecretKey' ], 'writing', 'getwid' );
        register_setting( 'writing', 'getwid_recaptcha_v2_secret_key', [ 'type' => 'text', 'default' => '' ] );
        /* #endregion */

        /* #region Mailchimp Api Key */
        add_settings_field( 'getwid_mailchimp_api_key', __( 'Mailchimp API Key', 'getwid' ),
            [ $this, 'renderMailchimpApiKey' ], 'writing', 'getwid' );
        register_setting( 'writing', 'getwid_mailchimp_api_key', [ 'type' => 'text', 'default' => '' ] );
        /* #endregion */
    }

    public function renderSectionContentWidth() {

        $field_val = get_option( 'getwid_section_content_width', '' );

        echo '<input type="number" id="getwid_section_content_width" name="getwid_section_content_width" type="text" value="' . esc_attr( $field_val ) . '" />';
        echo ' ', _x( 'px', 'pixels', 'getwid' );
		echo '<p class="description">' . __( 'Default width of content area in the Section block. Leave empty to use the width set in your theme.', 'pixels', 'getwid' ) . '</p>';
    }

    public function renderInstagramToken() {

        $field_val = get_option('getwid_instagram_token', '');
        echo '<input type="text" id="getwid_instagram_token" name="getwid_instagram_token" class="regular-text" value="' . esc_attr( $field_val ) . '" />';
        echo '<p><a href="' . esc_url(
			'https://instagram.com/oauth/authorize/?client_id=4a65e04032894be69e06239a6d620d69&redirect_uri=' .
			'https://api.getmotopress.com/get_instagram_token.php&response_type=code&state=' .
			admin_url( 'options-writing.php' )
		) . '" class="button button-default">' . __( 'Connect Instagram Account', 'getwid' ) . '</a>
        </p>';
    }

    public function renderGoogleApiKey() {

        $field_val = get_option('getwid_google_api_key', '');

        echo '<input type="text" id="getwid_google_api_key" name="getwid_google_api_key" class="regular-text" value="' . esc_attr( $field_val ) . '" />';
    }

    public function renderRecaptchaSiteKey() {

        $field_val = get_option( 'getwid_recaptcha_v2_site_key', '' );

        echo '<input type="text" id="getwid_recaptcha_v2_site_key" name="getwid_recaptcha_v2_site_key" class="regular-text" value="' . esc_attr( $field_val ) . '" />';
    }

    public function renderRecaptchaSecretKey() {

        $field_val = get_option( 'getwid_recaptcha_v2_secret_key', '' );

        echo '<input type="text" id="getwid_recaptcha_v2_secret_key" name="getwid_recaptcha_v2_secret_key" class="regular-text" value="' . esc_attr( $field_val ) . '" />';
    }

    public function renderMailchimpApiKey() {

        $field_val = get_option( 'getwid_mailchimp_api_key', '' );

        echo '<input type="text" id="getwid_mailchimp_api_key" name="getwid_mailchimp_api_key" class="regular-text" value="' . esc_attr( $field_val ) . '" />';
    }
}
