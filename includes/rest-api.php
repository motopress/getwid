<?php

namespace Getwid;

/**
 * Class REST API
 * @package Getwid
 */
class RestAPI {

	protected $_namespace = 'getwid/v1';

	protected $remote_template_library_url;

	/**
	 * RestAPI constructor.
	 */
	public function __construct( ) {

		$this->remote_template_library_url = defined( 'GETWID_REMOTE_TEMPLATE_LIBRARY_URL' ) ?
			GETWID_REMOTE_TEMPLATE_LIBRARY_URL : 'https://cgw.motopress.com';

		add_action( 'rest_api_init', [ $this, 'register_rest_route' ] );

	}

	public function register_rest_route(){

		register_rest_route( $this->_namespace, '/get_remote_templates', array(
			array(
				'methods'   => 'GET',
				'callback' => [ $this, 'get_remote_templates' ],
				'permission_callback' => [ $this, 'permissions_check' ],
			)
		) );

		register_rest_route( $this->_namespace, '/get_remote_content', array(
			array(
				'methods'   => 'GET',
				'callback' => [ $this, 'get_remote_content' ],
				'permission_callback' => [ $this, 'permissions_check' ],
			)
		) );

		register_rest_route( $this->_namespace, '/taxonomies', array(
			array(
				'methods'   => 'GET',
				'callback' => [ $this, 'get_taxonomies' ],
				'permission_callback' => [ $this, 'permissions_check' ],
			),
			'schema' => array( $this, 'taxonomy_schema' )
		) );

		register_rest_route( $this->_namespace, '/terms', array(
			array(
				'methods'   => 'GET',
				'callback' => [ $this, 'get_terms' ],
				'permission_callback' => [ $this, 'permissions_check' ],
			),
			'schema' => array( $this, 'terms_schema' )
		) );

		register_rest_route( $this->_namespace, '/templates', array(
			array(
				'methods'   => 'GET',
				'callback' => [ $this, 'get_templates' ],
				'permission_callback' => [ $this, 'permissions_check' ],
			),
			'schema' => array( $this, 'templates_schema' )
		) );
	}

	public function permissions_check( $request ) {
		if ( ! current_user_can( 'read' ) ) {
			return new \WP_Error(
				'rest_forbidden',
				esc_html__( 'Forbidden.' ),
				array( 'status' => $this->authorization_status_code() )
			);
		}

		return true;
	}

	// Sets up the proper HTTP status code for authorization.
	public function authorization_status_code() {

		$status = 401;

		if ( is_user_logged_in() ) {
			$status = 403;
		}

		return $status;
	}

    /**
     * Schema for a taxonomy.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function taxonomy_schema() {
        $schema = array(
            '$schema'              => 'http://json-schema.org/draft-04/schema#',
            'title'                => 'taxonomy',
            'type'                 => 'object',
            'properties'           => array(
                'post_type_name' => array(
                    'description'  => esc_html__( 'Post Type' ),
                    'type'         => 'string',
                    'context'      => array( 'view', 'edit', 'embed' ),
                    'readonly'     => true,
                )
            )
        );

        return $schema;
	}

    /**
     * Schema for a terms.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function terms_schema() {
        $schema = array(
            '$schema'              => 'http://json-schema.org/draft-04/schema#',
            'title'                => 'terms',
            'type'                 => 'object',
            'properties'           => array(
                'taxonomy_name' => array(
                    'description'  => esc_html__( 'Taxonomy' ),
                    'type'         => 'string',
                    'context'      => array( 'view', 'edit', 'embed' ),
                    'readonly'     => true,
                )
            )
        );

        return $schema;
    }

	    /**
     * Schema for a templates.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function templates_schema() {
        $schema = array(
            '$schema'              => 'http://json-schema.org/draft-04/schema#',
            'title'                => 'templates',
            'type'                 => 'object',
            'properties'           => array(
                'post_type_name' => array(
                    'description'  => esc_html__( 'Templates' ),
                    'type'         => 'string',
                    'context'      => array( 'view', 'edit', 'embed' ),
                    'readonly'     => true,
                )
            )
        );

        return $schema;
	}

	public function get_remote_templates() {

		$cache = sanitize_text_field( wp_unslash( $_GET['cache'] ) );
		$templates_data = [];

		if ($cache == 'cache'){
			$templates_data = get_transient( 'getwid_templates_response_data' ); //Get Cache response
		} elseif ($cache == 'refresh') {
			delete_transient( 'getwid_templates_response_data' ); //Delete cache data
		}

		if ( $templates_data == false || empty( $templates_data ) ) {

			//Get Templates from remote server
			$response = wp_remote_get(
				$this->remote_template_library_url . "/wp-json/getwid-templates-server/v1/get_templates",
				array(
					'timeout' => 15,
				)
			);
			// var_dump( $response ); exit();

			if ( is_wp_error( $response ) ) {
				return '<p>' . $response->get_error_message() . '</p>';
			} else {

				$templates_data = json_decode( wp_remote_retrieve_body( $response ), false );

				//JSON valid
				if ( json_last_error() === JSON_ERROR_NONE && $templates_data ) {

					set_transient( 'getwid_templates_response_data', $templates_data, 24 * HOUR_IN_SECONDS ); //Cache response
					return $templates_data;

				} else {
					return __( 'Error in json_decode.', 'getwid' );
				}
			}
		} else {
			return $templates_data;
		}
	}

	public function get_remote_content() {
		$get_content_url = esc_url_raw( $_GET['get_content_url'] );

		//Get Templates from remote server
		$response = wp_remote_get(
			$get_content_url,
			array(
				'timeout' => 15,
				)
		);

		// var_dump( wp_remote_retrieve_body( $response ) ); exit();

		$templates_data = json_decode( wp_remote_retrieve_body( $response ) );

		//JSON valid
		if ( json_last_error() === JSON_ERROR_NONE ) {
			return $templates_data;
		} else {
			return __( 'Error in json_decode.', 'getwid' );
		}
	}

	public function get_taxonomies($object) {
		$post_type_name = sanitize_text_field( wp_unslash( $_GET['post_type_name'] ) );
		$taxonomies = get_object_taxonomies( $post_type_name, 'objects' );

		$return = [];
		if (!empty($taxonomies)){
			foreach ($taxonomies as $key => $taxonomy_name) {
				$return[] = array(
					'value' => $key,
					'label' => $taxonomy_name->labels->name.' ('.$key.')'
				);
			}
		}
		return $return;
	}

	public function get_terms($object) {
		$taxonomy_name = getwid_recursive_sanitize_array( wp_unslash( $_GET['taxonomy_name'] ) );

		$return = [];
		$terms = get_terms(array(
			'taxonomy'   => $taxonomy_name,
			'hide_empty' => false,
		));

		if (!empty($terms)){
			foreach ($terms as $key => $term_name) {
				$taxonomy_obj = get_taxonomy( $term_name->taxonomy );

				$return[$term_name->taxonomy]['group_name'] = $taxonomy_obj->label;
				$return[$term_name->taxonomy]['group_value'][] = array(
					'value' => $term_name->taxonomy.'['.$term_name->term_id.']',
					'label' => $term_name->name,
				);
			}
		}
		return $return;
	}

	public function get_templates($object) {
		$template_name = sanitize_text_field( wp_unslash( $_GET['template_name'] ) );

		$posts = get_posts( array(
			'numberposts' => -1,
			'orderby'     => 'date',
			'order'       => 'DESC',
			'post_type'   => $template_name,
		) );

		$return = [];
		if (!empty($posts)){
			foreach ($posts as $key => $post) {
				$return[] = array(
					'value' => $post->ID,
					'label' => $post->post_title
				);
			}
		}
		return $return;
	}
}
