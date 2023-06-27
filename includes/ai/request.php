<?php

namespace Getwid\AI;

use Exception;
use WP_Error;

final class AIRequest {

    public function __construct() {

    }

    public function post( $url, $params ) {

		$response = wp_remote_post( $url,
            [
                'method'    => 'POST',
                'timeout' 	=> 120,
                'sslverify' => false,
                'headers'   => [
                    'content-type' => 'application/json'
                ],
                'body' => json_encode( $params )
            ]
        );

        $response_code = wp_remote_retrieve_response_code( $response );

        if ( 200 !== $response_code ) {

            wp_send_json_error( esc_html__( 'Something went wrong with GetwidAI API', 'getwid' ) );

        }

        if ( is_wp_error( $response ) ) {

            $error_message = $response->get_error_message();
            wp_send_json_error( $error_message );

        }

        return json_decode( wp_remote_retrieve_body( $response ) );

    }

    public function stream( $url, $params ) {

        if ( ! function_exists('curl_init') || ! function_exists('curl_setopt') ) {

            return rest_ensure_response(
                new WP_Error(
                    'curl_missing',
                    esc_html__( "cURL support is required, but can not be found.", 'getwid' ),
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

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 300);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Getwid-Client-Email: ' . get_bloginfo('admin_email'),
                'Getwid-AI-API-Version: 1.0'
            ]);
            curl_setopt($ch, CURLOPT_HEADERFUNCTION, function($curl, $header) {

                if ( strpos( $header, 'Content-Type:' ) === 0 ) {

                    header( $header );

                    // if ( strpos( $header, 'application/json' ) ) {
                    //     http_response_code( 500 );
                    // }

                }


                if ( strpos($header, "HTTP/") === 0 ) {

                    // Extract the status code from the header
                    $statusCode = intval( explode(" ", $header)[1]);
                    http_response_code( $statusCode );

                }

                return strlen( $header );
            });
            curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $data) {

                echo $data;

                flush();
                ob_flush();

                return strlen($data);

            });
            curl_exec($ch);
            curl_close($ch);

        } catch (Exception $e) {

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