<?php

namespace Getwid;

class TokenManager {
	public $getwid_hook_name = 'getwid_refresh_instagram_token';

	public function __construct() {
		// Deactivation hook.
		register_deactivation_hook( __FILE__, [ $this, 'clear_scheduled_event' ] );

		add_action( 'getwid_refresh_instagram_token', [ $this, 'send_token_refresh_event' ] );
		add_filter( 'cron_schedules', [ $this , 'send_token_check_schedule' ] );
	}

	public function check_instagram_token_value( $old_value, $value ) {
		if ( $value === '' ) {
			$this->clear_scheduled_event();
		} else {
			if ( ! wp_next_scheduled( $this->getwid_hook_name ) ) {
				wp_schedule_event( time(), 'two_month', $this->getwid_hook_name );
			}
		}
	}

	public function send_token_check_schedule() {
		$schedules[ 'two_month' ] = [
			'interval' => 1417 * 60 * 60,
			'display'  => 'Once in two months.'
		];

		return $schedules;
	}

	public function schedule_instagram_token_refresh_event() {
		add_action( 'update_option_getwid_instagram_token', [ $this, 'check_instagram_token_value' ], 10, 2 );
	}

	public function send_token_refresh_event() {
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return;
		}

		$this->instagramTokenRefreshAPI();
	}

	public function clear_scheduled_event() {
		$timestamp = wp_next_scheduled( $this->getwid_hook_name );

		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, $this->getwid_hook_name );
		}
	}

	public function instagramTokenRefreshAPI() {
		$field_val = get_option( 'getwid_instagram_token' );

		if ( ! empty( $field_val ) ) {
			$api_req  = 'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' . $field_val;
			$response = wp_remote_get( $api_req );

			if ( is_wp_error( $response ) ) {
				update_option( 'getwid_instagram_token_cron_error_message', $response->get_error_message() );
			} else {
 				$response_body = json_decode( wp_remote_retrieve_body( $response ) );

				if ( ! empty( $response_body ) || is_array( $response_body ) ) {

					if ( $response_body->error ) {
						update_option( 'getwid_instagram_token_cron_error_message', $response_body->error->message );
					} else {
						update_option( 'getwid_instagram_token_cron_error_message', '' );
						$response_body_expires = $response_body->expires_in;

						if ( $response_body_expires <= 5184000 ) {
							$response_body_generate_token = $response_body->access_token;
							update_option( 'getwid_instagram_token', $response_body_generate_token );
						}
					}
				} else {
					update_option( 'getwid_instagram_token_cron_error_message', __( 'An error occurred in token json_decode.', 'getwid' ) );
				}
			}
		}
	}
}