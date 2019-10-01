<?php

namespace Getwid;

/**
 * Class REST API
 * @package Getwid
 */
class RestAPI {
	
	protected $_namespace = 'getwid/v1';

	/**
	 * RestAPI constructor.
	 */
	public function __construct( ) {

		add_action( 'rest_api_init', [ $this, 'register_rest_route' ] );
	}


	public function register_rest_route(){ 	
		
		register_rest_route( $this->_namespace, '/taxonomies', array(
			array(
				'methods'   => 'GET',
				'callback' => [ $this, 'get_taxonomies' ],
				'permission_callback' => [ $this, 'permissions_check' ],
			),
			'schema' => array( $this, 'taxonomy_schema' ),
		) );

		register_rest_route( $this->_namespace, '/terms', array(
			array(
				'methods'   => 'GET',
				'callback' => [ $this, 'get_terms' ],
				'permission_callback' => [ $this, 'permissions_check' ],
			),
			'schema' => array( $this, 'terms_schema' ),
		) );

		register_rest_route( $this->_namespace, '/templates', array(
			array(
				'methods'   => 'GET',
				'callback' => [ $this, 'get_templates' ],
				'permission_callback' => [ $this, 'permissions_check' ],
			),
			'schema' => array( $this, 'templates_schema' ),
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
    public function taxonomy_schema( $request ) {
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
                ),
            ),
        );
 
        return $schema;
	}
	
    /**
     * Schema for a terms.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function terms_schema( $request ) {
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
                ),
            ),
        );
 
        return $schema;
    }	

	    /**
     * Schema for a templates.
     *
     * @param WP_REST_Request $request Current request.
     */
    public function templates_schema( $request ) {
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
                ),
            ),
        );
 
        return $schema;
	}

	public function get_taxonomies($object){ 
		$post_type_name = $_GET['post_type_name'];
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

	public function get_terms($object){ 
		$taxonomy_name = $_GET['taxonomy_name'];
		
		$return = [];
		$terms = get_terms(array(
			'taxonomy' => $taxonomy_name,
			'hide_empty' => true,
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

	public function get_templates($object){ 
		$template_name = $_GET['template_name'];

		$posts = get_posts( array(
			'numberposts' => -1,
			'orderby'     => 'date',
			'order'       => 'DESC',
			'post_type' => $template_name,
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