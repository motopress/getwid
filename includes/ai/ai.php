<?php

namespace Getwid\AI;

use WP_REST_Request;

final class AI {

	private $api_url;
	private $namespace = 'getwid/ai/v1';

	public function __construct() {

		$this->api_url = defined( 'GETWID_AI_API_URL' ) ? GETWID_AI_API_URL : 'https://api2.getmotopress.com';

		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );

		$this->register_user_meta();
	}

	public function register_user_meta() {

		register_meta(
			'user',
			'getwid_ai_accept_terms',
			[
				'type' => 'boolean',
				'single' => true,
				'show_in_rest' => true
			]
		);
	}

	public function register_rest_routes() {

		register_rest_route( $this->namespace, '/chat', array(
			'methods'   => 'POST',
			'callback' => array( $this, 'chat_callback' ),
			'permission_callback' => array( $this, 'permissions_check' ),
			'args' => array(
				'prompt' => array(
					'required' => true,
					'type' => 'string',
					'minLength' => 4
				)
			)
		) );
	}

	public function permissions_check() {

		if ( current_user_can( 'edit_posts' ) ) {
			return true;
		}

		return false;
	}

	public function chat_callback( WP_REST_Request $request ) {

		$ai_request = new AIRequest();

		return $ai_request->stream( $this->api_url . '/api/getwid-ai/v1/chat', $request->get_params() );
	}
}

new AI();
