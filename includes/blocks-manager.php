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

		add_action( 'init', [$this, 'includeBlocks'] );
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

			'template-part/post-title',
			'template-part/post-featured-image',
			'template-part/post-content',
			'template-part/post-link',
			'template-part/post-author',
			'template-part/post-categories',
			'template-part/post-comments',
			'template-part/post-tags',
			'template-part/post-date',
			'template-part/post-featured-background-image',
			
			'contact-form',
			'contact-form-name',
			'contact-form-email',
			'contact-form-message'
		);

		foreach ($blocks as $key => $block_name) {
			$path = getwid_get_plugin_path('/includes/blocks/'.$block_name.'.php');

			if (file_exists($path)){
				require_once($path);
			}
		}
	}
}