<?php

namespace Getwid\Blocks\TemplateParts;

class PostContent extends \Getwid\Blocks\AbstractBlock {

	protected static $assets_handle = 'getwid/template-parts';

	public function __construct() {

		parent::__construct( 'getwid/template-post-content' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/template-parts/post-content' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Content', 'getwid' );
	}

	public function can_be_disabled() {
		return false;
	}

	public function render_callback( $attributes, $content ) {

		if ( ( get_post_type() === getwid()->postTemplatePart()->postType ) || ( get_post_type() === 'revision' ) ) {
			return $content;
		}

		$block_name    = 'wp-block-getwid-template-post-content';
		$wrapper_class = $block_name;
		$wrapper_style = '';

		if ( isset( $attributes['className'] ) ) {
			$wrapper_class .= ' ' . esc_attr( $attributes['className'] );
		}

		if ( isset( $attributes['showContent'] ) ) {
			$wrapper_class .= ' is-' . esc_attr( $attributes['showContent'] );
		}

		if ( isset( $attributes['textAlignment'] ) ) {
			$wrapper_style .= 'text-align: ' . esc_attr( $attributes['textAlignment'] ) . ';';
		}

		if ( isset( $attributes['customFontSize'] ) ) {
			$font_size      = is_numeric( $attributes['customFontSize'] ) ? $attributes['customFontSize'] . 'px' : $attributes['customFontSize'];
			$wrapper_style .= 'font-size: ' . esc_attr( $font_size ) . ';';
		}

		if ( isset( $attributes['fontSize'] ) ) {
			$wrapper_class .= ' has-' . esc_attr( $attributes['fontSize'] ) . '-font-size';
		}

		$content_length = isset( $attributes['contentLength'] ) ? $attributes['contentLength'] : false;
		$current_post   = get_post( get_the_ID() );
		$is_back_end    = getwid_is_block_editor();

		getwid_custom_color_style_and_class( $wrapper_style, $wrapper_class, $attributes, 'color', $is_back_end );

		$extra_attr = array(
			'wrapper_class' => $wrapper_class,
			'wrapper_style' => $wrapper_style,
			'contentLength' => $content_length,
			'current_post'  => $current_post,
		);

		ob_start();

		getwid_get_template_part( 'template-parts/post-content', $attributes, false, $extra_attr );

		$result = ob_get_clean();

		return $result;
	}
}

getwid()->blocksManager()->addBlock(
	new PostContent()
);
