<?php

namespace Getwid;

/**
 * Class BlocksManager
 * @package Getwid
 */
class BlocksManager {

	private static $instance = null;

	private $blocks = array();

	private $activeBlocks = array();
	private $inactiveBlocks = array();

	/**
	 * BlockManager constructor.
	 */
	public function __construct() {

		add_filter( 'block_categories', [ $this, 'block_categories' ], 10, 2 );

		add_action( 'init', [$this, 'includeBlocks'] );
	}

	public static function getInstance()
	{
		if (self::$instance == null)
		{
			self::$instance = new BlocksManager();
		}
		return self::$instance;
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

	public function includeBlocks() {

		$block_files = array(
			'abstract-block',
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
			'contact-form',
			'mailchimp',
			'content-timeline',
		/* template-parts*/
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
		);

		// load block class
		foreach ( $block_files as $block_file_name ) {

			$path = getwid_get_plugin_path( '/includes/blocks/' . $block_file_name . '.php' );

			if ( file_exists( $path ) ) {
				require_once( $path );
			}
		}

		// fill array of active blocks
		foreach ( $this->blocks as $block ) {

			if ( $block->isEnabled() ) {
				$this->activeBlocks[] = $block;
			} else {
				$this->inactiveBlocks[] = $block;
			}
		}

	}

	public function addBlock( $block ) {

		if ( $block instanceof \Getwid\Blocks\AbstractBlock ) {
			$this->blocks[ $block::getBlockName() ] = $block;
		}
	}

	public function getBlocks() {
		return $this->blocks;
	}

	public function getActiveBlocks() {
		return $this->activeBlocks;
	}

	public function getInactiveBlocks() {
		return $this->inactiveBlocks;
	}

	public function hasActiveBlocks() {
		return ( sizeof ($this->activeBlocks ) > 0 );
	}

	public function hasInactiveBlocks() {
		return ( sizeof ($this->inactiveBlocks ) > 0 );
	}

	public function hasGetwidBlocks() {

		$has_getwid_blocks = false;

		if ( ! has_blocks() ) {
			return false;
		}

		if ( $this->hasActiveBlocks() ) {

			foreach ( $this->activeBlocks as $block ) {

				if ( has_block( $block->getBlockName() ) ) {
					$has_getwid_blocks = true;
				}
			}
		}

		return apply_filters( 'getwid/blocks/has_getwid_blocks', $has_getwid_blocks);
	}

}
