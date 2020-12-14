<?php

namespace Getwid;

class WritingSettings {

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

        if ( $pagenow == 'options-writing.php' && isset( $_GET['instagram-token'] ) ) {
			if ( current_user_can( 'manage_options' ) ) {
				// Update token
				update_option( 'getwid_instagram_token', trim( $_GET['instagram-token'] ) );
				// Delete cache data
				delete_transient( 'getwid_instagram_response_data' );
				// Schedule token refresh
				//getwid()->tokenManager()->schedule_token_refresh_event();
			}
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

        add_settings_section(
			'getwid',
			'<span id="getwid-settings">' . __('Getwid Settings', 'getwid') . '</span>',
			$echoNothing,
			'writing'
		);
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

		/* #region Instagram Cache Timeout */
        add_settings_field( 'getwid_instagram_cache_timeout', __( 'Instagram Cache Timeout', 'getwid' ),
            [ $this, 'renderInstagramCacheTimeout' ], 'writing', 'getwid' );
        register_setting( 'writing', 'getwid_instagram_cache_timeout', [ 'type' => 'number', 'default' => 30 ] );
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

		/* #region Disabled Blocks */
        add_settings_field( 'getwid_disabled_blocks', __( 'Disable Getwid Blocks', 'getwid' ),
            [ $this, 'renderDisabledBlocks' ], 'writing', 'getwid' );

		$blocks = getwid()->blocksManager()->getBlocks();

		foreach ($blocks as $name => $block) {
			$option_name = $block->getDisabledOptionKey();
			register_setting( 'writing', $option_name, [ 'type' => 'boolean', 'default' => false, 'sanitize_callback' => 'rest_sanitize_boolean' ] );
		}
        /* #endregion */
    }

    public function renderSectionContentWidth() {

        $field_val = get_option( 'getwid_section_content_width', '' );

        echo '<input type="number" id="getwid_section_content_width" name="getwid_section_content_width" value="' . esc_attr( $field_val ) . '" />';
        echo ' ', _x( 'px', 'pixels', 'getwid' );
		echo '<p class="description">' . __( 'Default width of content area in the Section block. Leave empty to use the width set in your theme.', 'pixels', 'getwid' ) . '</p>';
    }

    public function renderInstagramToken() {

        $field_val = get_option('getwid_instagram_token', '');

        echo '<input type="text" id="getwid_instagram_token" name="getwid_instagram_token" class="regular-text" value="' . esc_attr( $field_val ) . '" />';
        echo '<p><a href="' . esc_url(
			'https://api.instagram.com/oauth/authorize?client_id=910186402812397&redirect_uri=' .
			'https://api.getmotopress.com/get_instagram_token.php&scope=user_profile,user_media&response_type=code&state=' .
			admin_url( 'options-writing.php' )
		) . '" class="button button-default">' . __( 'Connect Instagram Account', 'getwid' ) . '</a>';
		if (!empty($field_val)){
			echo ' <a href="' . esc_url(
				'https://api.getmotopress.com/refresh_instagram_token.php?access_token='.$field_val.'&state=' .
				admin_url( 'options-writing.php' )
			) . '" class="button button-default">' . __( 'Refresh Access Token', 'getwid' ) . '</a>';
		}
		echo '</p>';
    }

	public function renderInstagramCacheTimeout() {

        $field_val = get_option('getwid_instagram_cache_timeout');
        echo '<input type="number" id="getwid_instagram_cache_timeout" name="getwid_instagram_cache_timeout" value="' . esc_attr( $field_val ) . '" />';
		echo '<p class="description">' . __( 'Time until expiration of media data in minutes. Setting to 0 means no expiration.', 'pixels', 'getwid' ) . '</p>';
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

	public function renderDisabledBlocks() {

		$blocks = getwid()->blocksManager()->getBlocks();
		$disabledBlocks = getwid()->blocksManager()->getDisabledBlocks();
		ksort( $blocks );
		?>
		<p class="description">
			<?php printf( esc_html__('Total: %1$s, Disabled: %2$s', 'getwid'), sizeof($blocks), sizeof($disabledBlocks) ); ?><br/>
			<input type="button" id="getwid-disabled-blocks-select-all" class="button button-link" value="<?php esc_html_e('Select All', 'getwid'); ?>" />
			&nbsp;/&nbsp;
			<input type="button" id="getwid-disabled-blocks-deselect-all" class="button button-link" value="<?php esc_html_e('Deselect All', 'getwid'); ?>" />
		</p>
		<fieldset id="getwid-disabled-blocks">
		<?php
		foreach ($blocks as $name => $block) {
			$option_name = $block->getDisabledOptionKey();
			?>
			<label for="<?php echo esc_attr( $option_name ); ?>">
				<input type="checkbox" id="<?php echo esc_attr( $option_name ); ?>" name="<?php echo esc_attr( $option_name ); ?>" value="1" <?php
					checked( '1', $block->isDisabled() ); ?> />
				<?php echo $block->getLabel() ?>
			</label><br/>
			<?php
		}
		?>
		</fieldset>
		<script>
			jQuery(document).ready(function(){
				jQuery('#getwid-disabled-blocks-select-all').click(function(){
					jQuery('#getwid-disabled-blocks input:checkbox').attr('checked','checked');
				});
				jQuery('#getwid-disabled-blocks-deselect-all').click(function(){
					jQuery('#getwid-disabled-blocks input:checkbox').removeAttr('checked');
				});
			})
		</script>
		<?php
    }
}