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

		//Add Getwid post-block category
		if ( $post && ($post->post_type == 'getwid_template_part') ) {
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
			'map',
			'media-text-slider',
			'person',
			'post-carousel',
			'post-slider',
			'price-box',
			'progress-bar',
			'recent-posts',
			'section',
			'social-links',
			'tabs',
			'testimonial',
			'toggle',

			'template/post-title',
			'template/post-featured-image',
			'template/post-content',
			'template/post-link',
			'template/post-author',
			'template/post-categories',
			'template/post-comments',
			'template/post-tags',
			'template/post-date',
			'template/post-featured-background-image',
			'template/post-meta',
			
			'contact-form',
			'contact-form-name',
			'contact-form-email',
			'contact-form-message',
			'contact-form-captcha'
		);

		foreach ($blocks as $key => $block_name) {
			$path = getwid_get_plugin_path('/includes/blocks/' . $block_name . '.php');

			if (file_exists($path)){
				require_once($path);
			}
		}
	}
}