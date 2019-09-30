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
	 *
	 * @param Settings $settings Plugin settings
	 *
	 */
	public function __construct( $settings ) {

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
		if ( $post && ($post->post_type == PostTemplatePart::$postType) ) {
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
			'class.accordion',
			'class.advanced-heading',
			'advanced-spacer',
			'class.banner',
			'button-group',
			'class.circle-progress-bar',
			'class.counter',
			'custom-post-type',
			'class.icon-box',
			'class.icon',
			'class.image-box',
			'class.images-slider',
			'images-stack',
			'instagram',
			'map',
			'class.media-text-slider',
			'person',
			'class.post-carousel',
			'class.post-slider',
			'price-box',
			'price-list',
			'class.progress-bar',
			'recent-posts',
			'class.section',
			'social-links',
			'class.tabs',
			'testimonial',
			'toggle',
			'class.video-popup',
			'class.image-hotspot',
			'class.countdown',

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
			
			'class.contact-form',
			'class.mailchimp',
			'content-timeline'
		);

		foreach ($blocks as $key => $block_name) {
			$path = getwid_get_plugin_path('/includes/blocks/' . $block_name . '.php');

			if (file_exists($path)){
				require_once($path);
			}
		}
	}
}