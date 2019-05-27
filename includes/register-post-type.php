<?php

namespace Getwid;

/**
 * Class Post Template Part
 * @package Getwid
 */
class PostTemplatePart {

	private $version;
	private $prefix;

	/**
	 * PostTemplatePart constructor.
	 */
	public function __construct( $settings ) {
		$this->version = $settings->getVersion();
		$this->prefix  = $settings->getPrefix();		

		add_filter( 'allowed_block_types', [ $this, 'allow_blocks_list' ], 10, 2 );
		add_action( 'init', [ $this, 'register_post_types' ] );
	}

	function allow_blocks_list( $allowed_blocks, $post ){
		if($post->post_type == 'getwid_template_part'){
			/* $allowed_blocks = [
				'getwid/template-post-title',
				'getwid/template-post-featured-image',
				'getwid/template-post-content',
			]; */
			$allowed_blocks = true;
		} else {
			wp_enqueue_script(
				"{$this->prefix}-filter-blocks-js",
				getwid_get_plugin_url( 'includes/filter.blocks.js' ),
				[
					"{$this->prefix}-blocks-editor-js"
				],
				$this->version,
				true
			);			
		}
		return $allowed_blocks;	
	}

	public function register_post_types(){ 			
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
			'show_in_menu' => true,
			'menu_position' => 100,
			'menu_icon' => 'dashicons-category',
			'supports' => array(
				'title',
				'editor',
				'author',
				'revisions',	
			),
			'rewrite' => false,
			'show_in_rest' => true,
		);

		register_post_type( 'getwid_template_part', $args );
	}

}