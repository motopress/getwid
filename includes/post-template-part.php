<?php

namespace Getwid;

/**
 * Class Post Template Part
 * @package Getwid
 */
class PostTemplatePart {

	public $postType = 'getwid_template_part';

	/**
	 * PostTemplatePart constructor.
	 */
	public function __construct() {

		add_action( 'init', [ $this, 'register_post_type' ] );
	}

	public function register_post_type(){
		$labels = array(
			'name' => __( 'Templates', 'getwid' ),
			'singular_name' => __( 'Template', 'getwid' ),
			'menu_name' => __( 'Getwid Templates', 'getwid' ),
			'add_new' => __( 'New Template', 'getwid' ),
			'add_new_item' => __( 'Add New Template', 'getwid' ),
			'edit_item' => __( 'Edit Template', 'getwid' ),
			'new_item' => __( 'New Template', 'getwid' ),
			'view_item' => __( 'View Template', 'getwid' ),
			'search_items' => __( 'Search Templates', 'getwid' ),
			'not_found' =>  __( 'No templates found', 'getwid' ),
			'not_found_in_trash' => __( 'No templates found in Trash', 'getwid' ),
		);

		$args = array(
			'labels' => $labels,
			'has_archive' => false,
			'public' => false,
			'exclude_from_search' => true,
			'show_in_nav_menus' => false,
			'show_in_admin_bar' => false,
			'hierarchical' => false,
			'show_ui' => true,
			'show_in_menu' => false,
			'menu_position' => 100,
			'menu_icon' => 'dashicons-category',
			'supports' => array(
				'title',
				'editor',
				'author',
				'revisions',
			),
			'capabilities'        => array(
				'publish_posts'       => 'administrator',
				'edit_others_posts'   => 'administrator',
				'delete_posts'        => 'administrator',
				'delete_others_posts' => 'administrator',
				'read_private_posts'  => 'administrator',
				'edit_post'           => 'administrator',
				// 'edit_posts' 		  => 'administrator',
				'delete_post'         => 'administrator',
				'read_post'           => 'administrator',
				'create_posts'       => 'administrator',
			),
			'rewrite' => false,
			'show_in_rest' => true,
			// template
			'template' => array(
				array (
					'getwid/template-post-layout-helper',
				),
			),
		);

		register_post_type( $this->postType, $args );
	}

}
