<?php

namespace Getwid;

class InstagramTokenManager {

	public function __construct() {

		// Action hook to execute when the event is run
		add_action( 'getwid_refresh_instagram_token', [ $this, 'refresh_instagram_token' ] );
		add_filter( 'cron_schedules', [ $this , 'time_scheduled_event' ] );

		add_action( 'update_option', [ $this, 'update_option' ], 10, 3 );
		add_action( 'admin_init', [ $this, 'error_message' ] );
	}

	public function time_scheduled_event( $schedules ) {

		if ( !isset($schedules['two_weeks']) ) {
			/*
			 * https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens/
			 */
			$schedules[ 'two_weeks' ] = [
				'interval' => WEEK_IN_SECONDS * 2,
				'display'  => 'Once in Two Weeks'
			];
		}

		return $schedules;
	}

	public function schedule_token_refresh_event() {
		if ( ! wp_next_scheduled( 'getwid_refresh_instagram_token' ) ) {
			wp_schedule_event( time(), 'two_weeks', 'getwid_refresh_instagram_token' );
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

	public function refresh_instagram_token() {
		$getwid_instagram_token = get_option( 'getwid_instagram_token' );

		if ( ! empty( $getwid_instagram_token ) ) {
			$api_req  = 'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' . $getwid_instagram_token;
			$response = wp_remote_get( $api_req );

			if ( is_wp_error( $response ) ) {
				update_option( 'getwid_instagram_token_cron_error_message', $response->get_error_message() );
			} else {
 				$response_body = json_decode( wp_remote_retrieve_body( $response ), false );

				if ( $response_body && json_last_error() === JSON_ERROR_NONE ) {
					if ( isset( $response_body->error ) ) {
						update_option( 'getwid_instagram_token_cron_error_message', $response_body->error->message );
					} else {
						delete_option( 'getwid_instagram_token_cron_error_message' );

						if ( ! empty( $response_body->access_token ) ) {
							// Update token
							update_option( 'getwid_instagram_token', $response_body->access_token );
							// Delete cache data
							delete_transient( 'getwid_instagram_response_data' );
							// Schedule token refresh
							$this->schedule_token_refresh_event();
						}
					}
				} else {
					update_option( 'getwid_instagram_token_cron_error_message', __( 'Error in json_decode.', 'getwid' ) );
				}
			}
		}
	}

	public function getwid_instagram_notice_token_error() {
		$instagram_token_error_message = get_option( 'getwid_instagram_token_cron_error_message' );

		if ( ! empty( $instagram_token_error_message ) ) {
		?>
			<div class="notice notice-error">
				<p>
					<?php
						echo sprintf(
							//translators: %s is an error message
							__( 'An error occurred while updating Instagram access token: %s', 'getwid' ),
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

    	$is_getwid_settings_page = $pagenow == 'options-general.php' && ( isset($_GET['page']) && $_GET['page'] == 'getwid' );

		if ( $is_getwid_settings_page && current_user_can( 'manage_options' ) ) {
			if ( get_option( 'getwid_instagram_token_cron_error_message' ) !== '' ) {
				add_action( 'admin_notices', [ $this, 'getwid_instagram_notice_token_error' ] );
			}
		}
    }
}
