<?php

namespace Getwid;

class SettingsPage {

    public function __construct()
    {
        $this->addActions();
    }

    protected function addActions()
    {
        add_action('admin_menu', [$this, 'registerPage']);
        add_action('admin_init', [$this, 'registerSettingsGroups']);
        add_action('admin_init', [$this, 'registerFields']);
        add_action('admin_init', [$this, 'checkInstagramQueryURL']);
    }

    public function getSettingsGroups()
	{
		return [
			'general' => __('General', 'getwid'),
			'appearance' => __('Appearance', 'getwid'),
			'blocks' => __('Blocks', 'getwid'),
			'post_templates' => __('Post Templates', 'getwid'),
		];
	}

    public function registerPage()
	{
		add_options_page(
			esc_html_x('Getwid Settings' , 'Settings page title', 'getwid'),
			esc_html_x('Getwid', 'Settings page title(in menu)', 'getwid'),
			'manage_options',
			'getwid',
			[$this, 'renderPage']
		);
	}

	public function registerSettingsGroups()
	{
		$settings_groups = $this->getSettingsGroups();

		foreach ($settings_groups as $id => $title){
			add_settings_section(
				'getwid_' . $id,
				'',
				'',
				'getwid_' . $id
			);
		}
	}

	public function renderPage()
	{
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$active_tab_id = $this->getActiveTabID();
		$settings_groups = $this->getSettingsGroups();

		settings_errors('getwid_settings_errors');
		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

			<h2 class="nav-tab-wrapper">
				<?php
				foreach ($settings_groups as $tab_id => $tab_title) :
					$active_tab_class = $tab_id == $active_tab_id ? 'nav-tab-active' : '';
				?>
					<a href="<?php echo esc_url( $this->getTabUrl($tab_id) ); ?>" class="nav-tab <?php echo esc_attr($active_tab_class); ?>">
						<?php echo esc_html($tab_title)?>
					</a>
				<?php
				endforeach;
				?>
			</h2>
			<?php
				if ( 'post_templates' == $active_tab_id ) :

				$this->renderPostTemplatesTab();

				else :
			?>
			<form action="options.php" method="post">
				<?php
				settings_fields( 'getwid_' . $active_tab_id );
				do_settings_sections( 'getwid_' . $active_tab_id );

				submit_button( esc_html__('Save Changes', 'getwid') );
				?>
			</form>
			<?php
				endif;
			?>
		</div>
		<?php
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

        if ( $pagenow == 'options-general.php' && isset( $_GET['instagram-token'] ) ) {
			if ( current_user_can( 'manage_options' ) ) {
				// Update token
				update_option( 'getwid_instagram_token', trim( $_GET['instagram-token'] ) );
				// Delete cache data
				delete_transient( 'getwid_instagram_response_data' );
				// Schedule token refresh
				getwid()->instagramTokenManager()->schedule_token_refresh_event();
			}

			$redirect_url = add_query_arg(
				[
					'getwid-instagram-success' => true
				],
				$this->getTabUrl('general')
			);

			wp_redirect( $redirect_url );
        }

        if (isset($_GET['getwid-instagram-success'])) {
            add_action( 'admin_notices', [$this, 'getwid_instagram_notice_success'] );
        }

        if (isset($_GET['instagram-error'])) {
            add_action( 'admin_notices', [$this, 'getwid_instagram_notice_error'] );
        }
    }

    public function registerFields() {

        /* #region Section Content Width */
        add_settings_field( 'getwid_section_content_width', __( 'Section Content Width', 'getwid' ),
            [ $this, 'renderSectionContentWidth' ], 'getwid_appearance', 'getwid_appearance' );
        register_setting( 'getwid_appearance', 'getwid_section_content_width', [ 'type' => 'number', 'default' => '' ] );
        /* #endregion */

		/* #region Animation */
		add_settings_field( 'getwid_animation', __( 'Animation', 'getwid' ),
				[ $this, 'renderAnimation' ], 'getwid_appearance', 'getwid_appearance' );
		register_setting( 'getwid_appearance', 'getwid_smooth_animation', [ 'type' => 'boolean', 'default' => false, 'sanitize_callback' => 'rest_sanitize_boolean' ] );
		/* #endregion */

		/* #region AssetsOptimization */
		add_settings_field( 'getwid_assets_optimization', __( 'Performance Optimization', 'getwid' ) . ' (Beta)',
				[ $this, 'renderAssetsOptimization'], 'getwid_general', 'getwid_general' );
		register_setting( 'getwid_general', 'getwid_load_assets_on_demand', [ 'type' => 'boolean', 'default' => false, 'sanitize_callback' => 'rest_sanitize_boolean' ] );

		register_setting( 'getwid_general', 'getwid_move_css_to_head', [ 'type' => 'boolean', 'default' => false, 'sanitize_callback' => 'rest_sanitize_boolean' ] );
		/* #endregion */

        /* #region Instagram Access Token */
        add_settings_field( 'getwid_instagram_token', __( 'Instagram Access Token', 'getwid' ),
            [ $this, 'renderInstagramToken' ], 'getwid_general', 'getwid_general' );
        register_setting( 'getwid_general', 'getwid_instagram_token', [ 'type' => 'text', 'default' => '' ] );
        /* #endregion */

		/* #region Instagram Cache Timeout */
        add_settings_field( 'getwid_instagram_cache_timeout', __( 'Instagram Cache Timeout', 'getwid' ),
            [ $this, 'renderInstagramCacheTimeout' ], 'getwid_general', 'getwid_general' );
        register_setting( 'getwid_general', 'getwid_instagram_cache_timeout', [ 'type' => 'number', 'default' => 30 ] );
        /* #endregion */

        /* #region Google API Key */
        add_settings_field( 'getwid_google_api_key', __( 'Google Maps API Key', 'getwid' ),
            [ $this, 'renderGoogleApiKey' ], 'getwid_general', 'getwid_general' );
        register_setting( 'getwid_general', 'getwid_google_api_key', [ 'type' => 'text', 'default' => '' ] );
        /* #endregion */

        /* #region Recaptcha Site Key */
        add_settings_field( 'getwid_recaptcha_v2_site_key', __( 'Recaptcha Site Key', 'getwid' ),
            [ $this, 'renderRecaptchaSiteKey' ], 'getwid_general', 'getwid_general' );
        register_setting( 'getwid_general', 'getwid_recaptcha_v2_site_key', [ 'type' => 'text', 'default' => '' ] );
        /* #endregion */

        /* #region Recaptcha Secret Key */
        add_settings_field( 'getwid_recaptcha_v2_secret_key', __( 'Recaptcha Secret Key', 'getwid' ),
            [ $this, 'renderRecaptchaSecretKey' ], 'getwid_general', 'getwid_general' );
        register_setting( 'getwid_general', 'getwid_recaptcha_v2_secret_key', [ 'type' => 'text', 'default' => '' ] );
        /* #endregion */

        /* #region Mailchimp Api Key */
        add_settings_field( 'getwid_mailchimp_api_key', __( 'Mailchimp API Key', 'getwid' ),
            [ $this, 'renderMailchimpApiKey' ], 'getwid_general', 'getwid_general' );
        register_setting( 'getwid_general', 'getwid_mailchimp_api_key', [ 'type' => 'text', 'default' => '' ] );
        /* #endregion */

		/* #region Disabled Blocks */
        add_settings_field( 'getwid_disabled_blocks', __( 'Disable Getwid Blocks', 'getwid' ),
            [ $this, 'renderDisabledBlocks' ], 'getwid_blocks', 'getwid_blocks' );

		$blocks = getwid()->blocksManager()->getBlocks();

		foreach ($blocks as $name => $block) {
			$option_name = $block->getDisabledOptionKey();
			register_setting( 'getwid_blocks', $option_name, [ 'type' => 'boolean', 'default' => false, 'sanitize_callback' => 'rest_sanitize_boolean' ] );
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
			admin_url( 'options-general.php' ) ) . '" class="button button-default">' . __( 'Connect Instagram Account', 'getwid' ) . '</a>';
		if ( ! empty( $field_val) ) {
			echo ' <a href="' . esc_url(
				'https://api.getmotopress.com/refresh_instagram_token.php?access_token='.$field_val.'&state=' .
				$this->getTabUrl('general') ) . '" class="button button-default">' . __( 'Refresh Access Token', 'getwid' ) . '</a>';
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
			<?php
				printf(
					//translators: %1$s, %2$s is a number of total and disabled blocks
					esc_html__('Total: %1$s, Disabled: %2$s', 'getwid'),
					sizeof($blocks),
					sizeof($disabledBlocks)
				);
			?><br/>
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

	public function renderPostTemplatesTab() {
		?>
		<p><?php _e( 'Post Templates are used for presenting posts in a certain format and style. You can change how a post looks by choosing a post template in the Custom Post Type and related blocks.', 'getwid' ); ?></p>
		<a class="button button-primary" href="<?php echo admin_url('edit.php?post_type=getwid_template_part'); ?>"><?php _e( 'Manage Post Templates', 'getwid' ); ?></a>
		<?php
	}

	public function renderAnimation() {

		$field_val = get_option( 'getwid_smooth_animation', false );
		?>
		<label for="getwid_smooth_animation">
			<input type="checkbox" id="getwid_smooth_animation" name="getwid_smooth_animation" value="1" <?php
				checked( '1', $field_val ); ?> />
			<?php echo esc_html__('Enable smooth animation of blocks', 'getwid'); ?>
		</label>
		<p class="description"><?php
			echo esc_html__('Hides block until the entrance animation starts. Prevents possible occurrence of horizontal scroll during the animation.', 'getwid');
			?></p>
		<?php
	}

	public function renderAssetsOptimization() {

		$getwid_load_assets_on_demand = get_option( 'getwid_load_assets_on_demand', false );
		$getwid_move_css_to_head = get_option( 'getwid_move_css_to_head', false );
		?>
		<fieldset>
			<label for="getwid_load_assets_on_demand">
				<input type="checkbox" id="getwid_load_assets_on_demand" name="getwid_load_assets_on_demand" value="1" <?php
					checked( '1', $getwid_load_assets_on_demand ); ?> />
				<?php echo esc_html__('Load CSS and JS of blocks on demand', 'getwid'); ?>
			</label>
			<p class="description"><?php
				echo esc_html__('If this option is on, all CSS and JS files of blocks will be loaded on demand in footer. This will reduce the amount of heavy assets on the page.', 'getwid');
				?></p>
			<br/>
			<label for="getwid_move_css_to_head">
				<input type="checkbox" id="getwid_move_css_to_head" name="getwid_move_css_to_head" value="1" <?php
					checked( '1', $getwid_move_css_to_head ); ?> />
				<?php echo esc_html__('Aggregate all CSS files of blocks in header', 'getwid'); ?>
			</label>
			<p class="description"><?php
				echo esc_html__('If this option is on, all CSS files of blocks will be moved to header for better theme compatibility. If your theme has custom styling for Getwid blocks, its styles will be applied first.', 'getwid');
				?></p>
			<br/>
			<p class="description"><?php
				echo esc_html__('These settings may break some blocks in posts loaded via Ajax. These settings may not work together with optimization plugins.', 'getwid');
				?></p>
		</fieldset>
		<script>
			jQuery(document).ready(function(){
				// set initial state
				jQuery('#getwid_move_css_to_head').toggleClass("disabled", ! jQuery('#getwid_load_assets_on_demand').prop("checked") );
				// bind state change
				jQuery('#getwid_load_assets_on_demand').change(function(e) {
					jQuery('#getwid_move_css_to_head').toggleClass("disabled", ! jQuery(this).prop("checked") );
				});
			})
		</script>
		<?php
	}

	public function getTabUrl( $tab = 'general' )
	{
    	return add_query_arg( [ 'page' => 'getwid', 'active_tab' => $tab ], admin_url( 'options-general.php' ) );
	}

	private function getActiveTabID()
	{
		$tab_param_isset = isset( $_GET['active_tab'] ) && array_key_exists( $_GET['active_tab'], $this->getSettingsGroups() );
		return  $tab_param_isset ? sanitize_text_field( $_GET['active_tab'] ) : 'general';
	}
}
