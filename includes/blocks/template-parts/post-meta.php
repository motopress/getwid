<?php

namespace Getwid\Blocks\TemplateParts;

class PostMeta extends \Getwid\Blocks\AbstractBlock {

	protected static $assets_handle = 'getwid/template-parts';

	public function __construct() {

		parent::__construct( 'getwid/template-post-meta' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/template-parts/post-meta' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Meta', 'getwid' );
	}

	public function can_be_disabled() {
		return false;
	}

	public function render_callback( $attributes, $content ) {

		if ( ( get_post_type() === getwid()->postTemplatePart()->postType ) || ( get_post_type() === 'revision' ) ) {
			return $content;
		}

		$block_name    = 'wp-block-getwid-template-post-meta';
		$wrapper_class = $block_name;
		$wrapper_style = '';

		if ( isset( $attributes['className'] ) ) {
			$wrapper_class .= ' ' . esc_attr( $attributes['className'] );
		}

		if ( isset( $attributes['direction'] ) ) {
			$wrapper_class .= ' has-direction-' . esc_attr( $attributes['direction'] );
		}

		if ( isset( $attributes['textAlignment'] ) ) {
			if ( isset( $attributes['direction'] ) && 'row' === $attributes['direction'] ) {
				$wrapper_class .= ' has-alignment-' . esc_attr( $attributes['textAlignment'] );
			} else {
				$wrapper_style .= 'text-align: ' . esc_attr( $attributes['textAlignment'] ) . ';';
			}
		}

		$is_back_end = getwid_is_block_editor();

		getwid_custom_color_style_and_class( $wrapper_style, $wrapper_class, $attributes, 'color', $is_back_end );

		$result     = '';
		$extra_attr = array(
			'wrapper_class' => $wrapper_class,
			'wrapper_style' => $wrapper_style,
			'content'       => $content,
		);

		if ( strlen( $content ) ) {
			ob_start();

			getwid_get_template_part( 'template-parts/post-meta', $attributes, false, $extra_attr );

			$result = ob_get_clean();
		}

		return $result;
	}
}

getwid()->blocksManager()->addBlock(
	new PostMeta()
);
