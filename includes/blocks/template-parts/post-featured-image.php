<?php

namespace Getwid\Blocks\TemplateParts;

class PostFeaturedImage extends \Getwid\Blocks\AbstractBlock {

	protected static $assets_handle = 'getwid/template-parts';

	public function __construct() {

		parent::__construct( 'getwid/template-post-featured-image' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/template-parts/post-featured-image' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Featured Image', 'getwid' );
	}

	public function can_be_disabled() {
		return false;
	}

	public function render_callback( $attributes, $content ) {

		if ( ( get_post_type() === getwid()->postTemplatePart()->postType ) || ( get_post_type() === 'revision' ) ) {
			return $content;
		}

		$block_name    = 'wp-block-getwid-template-post-featured-image';
		$wrapper_class = $block_name;

		if ( isset( $attributes['className'] ) ) {
			$wrapper_class .= ' ' . esc_attr( $attributes['className'] );
		}

		$wrapper_style = '';

		if ( isset( $attributes['align'] ) ) {
			$wrapper_class .= ' align' . esc_attr( $attributes['align'] );
		}

		$image_size = ( isset( $attributes['imageSize'] ) && $attributes['imageSize'] ) ? $attributes['imageSize'] : 'post-thumbnail';
		$result     = '';
		$extra_attr = array(
			'wrapper_class' => $wrapper_class,
			'wrapper_style' => $wrapper_style,
			'imageSize'     => $image_size,
		);

		if ( has_post_thumbnail() ) {
			ob_start();

			getwid_get_template_part( 'template-parts/post-featured-image', $attributes, false, $extra_attr );

			$result = ob_get_clean();
		}

		return $result;
	}
}

getwid()->blocksManager()->addBlock(
	new PostFeaturedImage()
);
