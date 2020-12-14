<?php

namespace Getwid;

/**
 * Class BlocksManager
 * @package Getwid
 */
class BlocksManager {

	private $blocks = array();
	private $enabledBlocks = array();
	private $disabledBlocks = array();

	/**
	 * BlockManager constructor.
	 */
	public function __construct() {

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
		if ( $post && ( $post->post_type == getwid()->postTemplatePart()->postType ) ) {
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

			'anchor',
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
			'table-of-contents',
			'video-popup',
			'image-hotspot',
			'countdown',
			'template-library',
			'contact-form',
			'mailchimp',
			'content-timeline',
			'table'
		);

		// load and register main blocks
		foreach ( $block_files as $block_file_name ) {
			$this->require_block($block_file_name);
		}

		// fill array of active blocks
		foreach ( $this->blocks as $block ) {

			if ( $block->isEnabled() ) {
				$this->enabledBlocks[] = $block;
			} else {
				$this->disabledBlocks[] = $block;
			}
		}

		$template_parts = array(
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

		// load template-parts blocks
		foreach ( $template_parts as $block_file_name ) {
			$this->require_block($block_file_name);
		}

	}

	private function require_block( $block_file_name ) {

		$path = getwid_get_plugin_path( '/includes/blocks/' . $block_file_name . '.php' );

		if ( file_exists( $path ) ) {
			require_once( $path );
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

	public function getEnabledBlocks() {
		return $this->enabledBlocks;
	}

	public function getDisabledBlocks() {
		return $this->disabledBlocks;
	}

	public function hasEnabledBlocks() {
		return ( sizeof ($this->enabledBlocks ) > 0 );
	}

	public function hasDisabledBlocks() {
		return ( sizeof ($this->disabledBlocks ) > 0 );
	}

	/**
	 * Determine whether a post or content string has Getwid blocks.
	 */
	public function hasGetwidBlocks() {

		$has_getwid_blocks = false;

		if ( has_blocks() ) {

			$blocks = $this->getBlocks();
			foreach ( $blocks as $block ) {

				if ( has_block( $block->getBlockName() ) ) {
					$has_getwid_blocks = true;
					break;
				}
			}
		}

		return apply_filters( 'getwid/blocks/has_getwid_blocks', $has_getwid_blocks);
	}

	public function hasGetwidNestedBlocks() {

		$has_getwid_nested_blocks = false;

		$nestedBlocks = [
			\Getwid\Blocks\PostCarousel::getBlockName(),
			\Getwid\Blocks\PostSlider::getBlockName(),
			\Getwid\Blocks\CustomPostType::getBlockName(),
		];

		foreach( $nestedBlocks as $block ) {
			if ( has_block($block) ) {
				$has_getwid_nested_blocks = true;
				break;
			}
		}

		return apply_filters( 'getwid/blocks/has_getwid_nested_blocks', $has_getwid_nested_blocks);
	}

}
