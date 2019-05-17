<?php

namespace Getwid;

/**
 * Class RestAPI
 * @package Getwid
 */
class RestAPI {

	/**
	 * RestAPI constructor.
	 */
	public function __construct( ) {
		include_once(ABSPATH.'wp-includes/class-wp-error.php');
		$this->namespace     = 'getwid/v1';
		//Get all terms (Extend REST API)
		add_action( 'rest_api_init', [ $this, 'getwid_register_route' ] ); //Custom Post Type
	}

	//Custom Post Type
	//(Call JS) addQueryArgs( `/wp/v2/getwid-get-terms`, {taxonomy_name : 'category'})
	public function getwid_register_route(){ 	
		register_rest_route( $this->namespace, '/taxonomies', array(
			// Here we register the readable endpoint for collections.
			array(
				'methods'   => 'GET',
				'callback' => [ $this, 'getwid_get_taxonomy' ],
				'permission_callback' => [ $this, 'getwid_permissions_check' ],
			),
			// Register our schema callback.
			'schema' => array( $this, 'getwid_taxonomy_schema' ),
		) );

		register_rest_route( $this->namespace, '/terms', array(
			// Here we register the readable endpoint for collections.
			array(
				'methods'   => 'GET',
				'callback' => [ $this, 'getwid_get_terms' ],
				'permission_callback' => [ $this, 'getwid_permissions_check' ],
			),
			// Register our schema callback.
			'schema' => array( $this, 'getwid_terms_schema' ),
		) );
	}   

	public function getwid_permissions_check( $request ) {
		if ( ! current_user_can( 'read' ) ) {
			return new \WP_Error( 'rest_forbidden', esc_html__( 'You cannot view the post resource.' ), array( 'status' => $this->authorization_status_code() ) );
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
    public function getwid_taxonomy_schema( $request ) {
        $schema = array(
            '$schema'              => 'http://json-schema.org/draft-04/schema#',
            'title'                => 'taxonomy',
            'type'                 => 'object',
            'properties'           => array(
                'post_type_name' => array(
                    'description'  => esc_html__( 'Post type', 'getwid' ),
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
    public function getwid_terms_schema( $request ) {
        $schema = array(
            '$schema'              => 'http://json-schema.org/draft-04/schema#',
            'title'                => 'terms',
            'type'                 => 'object',
            'properties'           => array(
                'taxonomy_name' => array(
                    'description'  => esc_html__( 'Taxonomy', 'getwid' ),
                    'type'         => 'string',
                    'context'      => array( 'view', 'edit', 'embed' ),
                    'readonly'     => true,
                ),
            ),
        );
 
        return $schema;
    }	

	public function getwid_get_taxonomy($object){ 
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

	public function getwid_get_terms($object){ 
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
	//Custom Post Type

}