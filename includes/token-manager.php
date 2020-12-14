<?php

namespace Getwid;

class TokenManager {

	public function __construct() {

		// Deactivation hook.
		register_deactivation_hook( GETWID_PLUGIN_FILE, [ $this, 'clear_scheduled_event' ] );

		// Action hook to execute when the event is run
		add_action( 'getwid_refresh_instagram_token', [ $this, 'refresh_instagram_token' ] );

		add_action( 'update_option', [ $this, 'update_option' ], 10, 3 );
		add_action( 'admin_init', [$this, 'error_message'] );
	}

	public function schedule_token_refresh_event() {

		$this->clear_scheduled_event();

		if ( ! wp_next_scheduled( 'getwid_refresh_instagram_token' ) ) {

			/*
			 * https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens/
			 */

			$interval = DAY_IN_SECONDS;
			//$interval = MONTH_IN_SECONDS;
			wp_schedule_single_event( time() + $interval, 'getwid_refresh_instagram_token' );
		}
	}

	public function update_option( $option_name, $old_value, $value ) {

		if ( $option_name === 'getwid_instagram_token' ) {

			delete_option( 'getwid_instagram_token_cron_error_message' );

			if ( $value === '' ) {
				$this->clear_scheduled_event();
			}
		}
	}

	public function clear_scheduled_event() {
		$timestamp = wp_next_scheduled( 'getwid_refresh_instagram_token' );

		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, 'getwid_refresh_instagram_token' );
		}
	}

	private function refresh_instagram_token() {

		$getwid_instagram_token = get_option( 'getwid_instagram_token' );

		if ( ! empty( $getwid_instagram_token ) ) {

			$api_req  = 'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' . $getwid_instagram_token;
			$response = wp_remote_get( $api_req );

			if ( is_wp_error( $response ) ) {
				update_option( 'getwid_instagram_token_cron_error_message', $response->get_error_message() );
			} else {
 				$response_body = json_decode( wp_remote_retrieve_body( $response ) );

				if ( ! empty( $response_body ) || is_array( $response_body ) ) {

					if ( $response_body->error ) {
						update_option( 'getwid_instagram_token_cron_error_message', $response_body->error->message );
					} else {

						delete_option( 'getwid_instagram_token_cron_error_message' );

						if ( !empty( $response_body->access_token ) ) {
							// Update token
							update_option( 'getwid_instagram_token', $response_body->access_token );
							//Delete cache data
							delete_transient( 'getwid_instagram_response_data' );
							// Schedule token refresh
							$this->schedule_token_refresh_event();
						}
					}
				} else {
					update_option( 'getwid_instagram_token_cron_error_message', __( 'An error occurred in token json_decode.', 'getwid' ) );
				}
			}
		}
	}

	public function getwid_instagram_notice_token_error() {

		$instagram_token_error_message = get_option( 'getwid_instagram_token_cron_error_message' );

		if ( !empty( $instagram_token_error_message ) ) {
		?>
			<div class="notice notice-error">
				<p>
					<?php
						echo sprintf(
							__( 'Update Instagram Token Error: %s', 'getwid' ),
							$instagram_token_error_message
						);
					?>
				</p>
			</div>
		<?php
		}
    }

	public function error_message() {

    	global $pagenow;

		if ( $pagenow && $pagenow == 'options-writing.php' && current_user_can( 'manage_options' ) ) {
			if ( get_option( 'getwid_instagram_token_cron_error_message' ) != '' ) {
				add_action( 'admin_notices', [ $this, 'getwid_instagram_notice_token_error' ] );
			}
		}
    }
}