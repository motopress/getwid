<?php

namespace Getwid;

class GetwidSettings
{
    public function __construct( $settings )
    {
		$this->version = $settings->getVersion();
		$this->prefix  = $settings->getPrefix();
        $this->addActions();
    }

    protected function addActions()
    {
		//Admin page
		add_action( 'admin_init', [ $this, 'getwid_register_settings' ] );
		add_action( 'admin_menu', [ $this, 'getwid_add_settings_page' ] );
    }

	public function getwid_admin_page_styles(){
		wp_enqueue_style(
			"{$this->prefix}-admin-page-styles",
			getwid_get_plugin_url( 'assets/css/admin.style.css' ),
			null,
			$this->version
		);
    }
    
	public function getwid_register_settings(){
		register_setting( 'getwid_settings', 'getwid_settings' );
	}

	public function getwid_add_settings_page(){
		add_menu_page( __( 'Getwid Settings', 'getwid' ), __( 'Getwid', 'getwid' ), 'manage_options', 'getwid_settings', [ $this, 'getwid_render_settings_page' ], plugins_url('../assets/img/getwid_logo.png', __FILE__));
		add_action( 'admin_enqueue_scripts', [$this, 'getwid_admin_page_styles'], 6 );
	}

	public function getwid_render_settings_page(){
		global $select_options;
		if ( ! isset( $_REQUEST['settings-updated'] ) ) $_REQUEST['settings-updated'] = false;
		?>
		<div class="getwid_settings_page">
			<h2 id="title"><?php _e( 'Getwid', 'getwid' ) ?></h2>

			<?php if (isset($_GET['error'])) { ?>
				<div id="message" class="notice notice-error">
					<p><strong><?php 
						if ($_GET['error'] == 'OAuthException'){
							_e('The user denied request');
						} else {
							_e('Access denied');
						}                    
					?></strong></p>
				</div>
			<?php } ?>

			<?php if (( false !== $_REQUEST['settings-updated'] ) || isset($_GET['token'])) { ?>
				<div id="message" class="updated">
                    <p><strong><?php 
                        if (isset($_GET['token'])){
                            _e('Instagram Access Token Updated.');
                        } else {
                            _e('Settings saved.');
                        }                    
                    ?></strong></p>
				</div>
            <?php } ?>
			<form method="post" action="options.php">
                <?php
                    settings_fields( 'getwid_settings' ); 
                    $options = get_option( 'getwid_settings');

                    if (isset($_GET['token'])){
                        $options['instagram_token'] = $_GET['token'];
                        update_option('getwid_settings', $options);
                    }
                ?>
                    <table>
						<tr valign="top">
                        <td><?php _e( 'Instagram Access Token', 'getwid' ) ?>:</td>
							<td>
                                <input id="getwid_settings[instagram_token]" type="text" size="38" name="getwid_settings[instagram_token]" value="<?php esc_attr_e( $options['instagram_token'] ); ?>" />
                                <p class="description"><?php _e( 'Enter Instagram Token', 'getwid' ); ?></p>
                            </td>
                        </tr>

						<tr valign="top">
                        <td><?php _e( 'Google API Key', 'getwid' ) ?>:</td>
                            <td>
                                <input id="getwid_settings[google_api_key]" type="text" size="38" name="getwid_settings[google_api_key]" value="<?php esc_attr_e( $options['google_api_key'] ); ?>" />
                                <p class="description"><?php _e( 'Enter Google API Key', 'getwid' ); ?></p>
                            </td>
                        </tr>
					</table>

				<p><input type="submit" id="submit" class="button button-primary" value="<?php _e('Save Changes') ?>" /></p>
			</form>

			<div class="getwid_admin_contact_us">
				<h3><i class="dashicons-before dashicons-editor-help" aria-hidden="true"></i> <?php _e( 'About us', 'getwid' ); ?></h3>
				<div class="getwid_admin_logo_wrapper">
					<img src="<?php echo esc_url(plugins_url('../assets/img/moto_press_logo.png', __FILE__)); ?>">
					<a href="https://motopress.com/">MotoPress</a>				
				</div>
			</div>

		</div>
		<?php
	}   
}
