<?php

namespace Getwid;

/**
 * Class BlocksManager
 * @package Getwid
 */
class BlocksManager {

	private $prefix;

	/**
	 * BlockManager constructor.	
	 */
	public function __construct() {
		$settings = Settings::getInstance();

		$this->prefix  = $settings->getPrefix();

		add_filter( 'block_categories', [ $this, 'block_categories' ], 10, 2 );
		add_action( 'init', [$this, 'includeBlocks'] );
	}	

	public function block_categories( $categories, $post ) {

		//Add Getwid blocks category
		$categories = array_merge(
			$categories,
			array(
				array(
					'slug' => 'getwid-blocks',
					'title' => __( 'Getwid Blocks', 'getwid' ),
				),
			)
		);

		//Add Getwid post-block category (Only on Templates page)
		if ( $post && ( $post->post_type == PostTemplatePart::$postType ) ) {
			$categories = array_merge(
				$categories,
				array(
					array(
						'slug' => 'getwid-post-blocks',
						'title' => __( 'Getwid Post Blocks', 'getwid' ),
					),
				)
			);
		}

		return $categories;
	}

	public function includeBlocks(){
		$blocks = array(
			'accordion',
			'advanced-heading',
			'advanced-spacer',
			'banner',
			'button-group',
			'circle-progress-bar',
			'counter',
			'custom-post-type',
			'icon-box',
			'icon',
			'image-box',
			'images-slider',
			'images-stack',
			'instagram',
			'google-map',
			'media-text-slider',
			'person',
			'post-carousel',
			'post-slider',
			'price-box',
			'price-list',
			'progress-bar',
			'recent-posts',
			'section',
			'social-links',
			'tabs',
			'testimonial',
			'toggle',
			'video-popup',
			'image-hotspot',
			'countdown',
			'template-library',

			'template-parts/post-title',
			'template-parts/post-featured-image',
			'template-parts/post-content',
			'template-parts/post-link',
			'template-parts/post-button',
			'template-parts/post-author',
			'template-parts/post-categories',
			'template-parts/post-comments',
			'template-parts/post-tags',
			'template-parts/post-date',
			'template-parts/post-featured-background-image',
			'template-parts/post-meta',
			'template-parts/post-custom-field',
			'template-parts/post-layout-helper',
			
			'contact-form',
			'mailchimp',
			'content-timeline'
		);

		foreach ( $blocks as $key => $block_name ) {
			$path = getwid_get_plugin_path( '/includes/blocks/' . $block_name . '.php' );

			if ( file_exists( $path ) ) {
				require_once( $path );
			}
		}
	}
}