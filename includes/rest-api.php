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
		//Get all terms (Extend REST API)
		add_action( 'rest_api_init', [ $this, 'getwid_register_route' ] ); //Custom Post Type
	}

	//Custom Post Type
	//(Call JS) addQueryArgs( `/wp/v2/getwid-get-terms`, {taxonomy_name : 'category'})
	public function getwid_register_route(){ 	
		register_rest_route('wp/v2', '/getwid-get-taxonomy', array(
			'methods' => 'GET',
			'callback' => [ $this, 'getwid_get_taxonomy' ],
		)); 			
		
		register_rest_route('wp/v2', '/getwid-get-terms', array(
			'methods' => 'GET',
			'callback' => [ $this, 'getwid_get_terms' ],
		)); 	
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