<?php

namespace Getwid;

/**
 * Class Post Template Part
 * @package Getwid
 */
class PostTemplatePart {

	/**
	 * PostTemplatePart constructor.
	 */
	public function __construct( ) {
		add_action( 'init', [ $this, 'register_post_types' ] );
	}

	public function register_post_types(){ 			
		$labels = array(
			'name' => __( 'Getwid Templates', 'getwid' ),
			'singular_name' => __( 'Getwid Templates', 'getwid' ),
			'add_new' => __( 'New Getwid Template', 'getwid' ),
			'add_new_item' => __( 'Add New Getwid Template', 'getwid' ),
			'edit_item' => __( 'Edit Getwid Template', 'getwid' ),
			'new_item' => __( 'New Getwid Template', 'getwid' ),
			'view_item' => __( 'View Getwid Template', 'getwid' ),
			'search_items' => __( 'Search Getwid Templates', 'getwid' ),
			'not_found' =>  __( 'No Getwid Templates Found', 'getwid' ),
			'not_found_in_trash' => __( 'No Getwid Templates found in Trash', 'getwid' ),
		);

		$args = array(
			'labels' => $labels,
			'has_archive' => true,
			'public' => true,
			'hierarchical' => false,
			'menu_position' => 5,
			'menu_icon' => 'dashicons-category',
			'supports' => array(
				'title',
				'editor',
				'author',
				'thumbnail',
				'excerpt',
				'trackbacks',
				'custom-fields',
				'revisions',
				'post-formats'	
			),
			'show_in_rest' => true,
		);
		  register_post_type( 'getwid_template_part', $args );
	}

}