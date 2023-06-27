<?php

namespace Getwid\AI;

use WP_REST_Request;

final class AI {

    private $api_url;
    private $namespace = 'getwid/ai/v1';

    public function __construct() {

		$this->api_url = defined( 'GETWID_AI_API_URL' ) ? GETWID_AI_API_URL : 'https://api2.getmotopress.com';

        add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );

    }

    public function register_rest_routes() {

        register_rest_route( $this->namespace, '/chat', array(
			'methods'   => 'POST',
			'callback' => array( $this, 'chat_callback' ),
			'permission_callback' => '__return_true',
			'args' => array(
				'prompt' => array(
					'required' => true,
					'type' => 'string',
					'minLength' => 4
				),
				'stream' => array(
					'required' => true,
					'type' => 'boolean',
					'default' => false
				),
			)
		) );

    }

    public function chat_callback( WP_REST_Request $request ) {

		$is_streamed = $request->get_param( 'stream' );
		$request->offsetUnset( 'stream' );

		$ai_request = new AIRequest();

		if ( $is_streamed ) {

			return $ai_request->stream( $this->api_url . '/api/getwid-ai/v1/chat', $request->get_params() );

		} else {

			return $ai_request->post( $this->api_url . '/api/getwid-ai/v1/chat', $request->get_params() );

		}

		die();

    }

}

new AI();