<?php

namespace Getwid\AI;

use Exception;
use WP_Error;
use WP_User;

final class AIRequest {

	public function stream( $url, $params ) {

		$current_user = wp_get_current_user();

		if ( ! ( $current_user instanceof WP_User ) ) {
			return rest_ensure_response(
				new WP_Error(
					'invalid_user',
					esc_html__( "Current user must be a valid instance of WP_User.", 'getwid' ),
					array(
						'status' => 400
					)
				)
			);
		}

		if ( ! function_exists( 'curl_init' ) || ! function_exists( 'curl_setopt' ) ) {

			return rest_ensure_response(
				new WP_Error(
					'curl_missing',
					esc_html__( "cURL support is required, but it can not be found.", 'getwid' ),
					array(
						'status' => 500
					)
				)
			);
		}

		try {

			header('Cache-Control: no-cache, must-revalidate');
			header('Connection: keep-alive');
			header('X-Accel-Buffering: no');

			set_time_limit(400);

			$ch = curl_init();
			curl_setopt( $ch, CURLOPT_URL, $url );
			curl_setopt( $ch, CURLOPT_POST, 1 );
			curl_setopt( $ch, CURLOPT_POSTFIELDS, http_build_query( $params ) );
			curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT, 300 );
			curl_setopt( $ch, CURLOPT_HTTPHEADER, [
				'Getwid-Client-Email: ' . $current_user->user_email,
				'Getwid-AI-API-Version: 1.0'
			] );
			curl_setopt( $ch, CURLOPT_HEADERFUNCTION, function ( $curl, $header ) {

				if ( strpos( $header, 'Content-Type:' ) === 0 ) {
					header( $header );
				}

				if ( strpos( $header, "HTTP/" ) === 0 ) {
					$statusCode = intval( explode( " ", $header )[1] );
					http_response_code( $statusCode );
				}

				return strlen( $header );
			} );
			curl_setopt( $ch, CURLOPT_WRITEFUNCTION, function ( $curl, $data ) {

				echo $data;

				flush();
				ob_flush();

				return strlen( $data );
			});
			curl_exec( $ch );
			curl_close( $ch );

		} catch ( Exception $e ) {

			return rest_ensure_response(
				new WP_Error(
					'server_error',
					esc_html__( "An error occurred when making a request to the Getwid AI server.", 'getwid' ),
					array(
						'status' => 500
					)
				)
			);
		}

		die();
	}
}
