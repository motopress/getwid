<?php

namespace Getwid\Blocks\TemplateParts\Acf;

class AcfBackgroundImage extends \Getwid\Blocks\AbstractBlock {

	protected static $assets_handle = 'getwid/template-parts/acf';

	public function __construct() {

		parent::__construct( 'getwid/template-acf-background-image' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/template-parts/acf/background-image' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'ACF Background Image', 'getwid' );
	}

	public function can_be_disabled() {
		return false;
	}

	public function render_callback( $attributes, $content ) {

		if ( ( get_post_type() === getwid()->postTemplatePart()->postType ) || ( get_post_type() === 'revision' ) ) {
			return $content;
		}

		$block_name    = 'wp-block-getwid-template-acf-background-image';
		$wrapper_class = $block_name;
		$wrapper_style = '';

		if ( isset( $attributes['className'] ) ) {
			$wrapper_class .= ' ' . esc_attr( $attributes['className'] );
		}

		if ( isset( $attributes['customField'] ) ) {
			$wrapper_class .= ' custom-field-' . esc_attr( $attributes['customField'] );
		}

		if ( isset( $attributes['minHeight'] ) ) {
			$wrapper_style .= 'min-height: ' . esc_attr( $attributes['minHeight'] ) . ';';
		}

		$image_size   = ( isset( $attributes['imageSize'] ) && $attributes['imageSize'] ) ? $attributes['imageSize'] : 'post-thumbnail';
		$current_post = get_post( get_the_ID() );

		$content_container_style = '';

		if ( isset( $attributes['contentMaxWidth'] ) ) {
			$content_container_style .= 'max-width: ' . esc_attr( $attributes['contentMaxWidth'] ) . 'px;';
		}

		$content_container_class = $block_name . '__content';

		getwid_custom_paddings_style_and_class( $wrapper_style, $wrapper_class, $attributes );
		getwid_custom_alignment_classes( $wrapper_class, $attributes );

		$foreground_style = '';
		$foreground_class = $block_name . '__foreground';

		if ( isset( $attributes['foregroundGradientType'] ) ) {
			getwid_custom_gradient_styles( 'foreground', $foreground_style, $attributes );
		}

		if ( isset( $attributes['foregroundOpacity'] ) && 35 !== $attributes['foregroundOpacity'] ) {
			$foreground_class .= ' getwid-opacity-' . esc_attr( $attributes['foregroundOpacity'] );
		}

		if ( isset( $attributes['foregroundColor'] ) ) {
			$foreground_style .= 'background-color: ' . esc_attr( $attributes['foregroundColor'] ) . ';';
		}

		if ( isset( $attributes['foregroundFilter'] ) ) {
			$foreground_style .= 'mix-blend-mode: ' . esc_attr( $attributes['foregroundFilter'] ) . ';';
		}

		$result     = '';
		$extra_attr = array(
			'block_name'              => $block_name,
			'wrapper_class'           => $wrapper_class,
			'wrapper_style'           => $wrapper_style,
			'current_post'            => $current_post,
			'imageSize'               => $image_size,
			'content_container_style' => $content_container_style,
			'content_container_class' => $content_container_class,
			'foreground_style'        => $foreground_style,
			'foreground_class'        => $foreground_class,
			'content'                 => $content,
		);

		if ( ( getwid_acf_is_active() && isset( $attributes['customField'] ) && has_post_thumbnail() ) || strlen( $content ) ) {
			ob_start();

			getwid_get_template_part( 'template-parts/acf/background-image', $attributes, false, $extra_attr );

			$result = ob_get_clean();
		}

		return $result;
	}
}

getwid()->blocksManager()->addBlock(
	new AcfBackgroundImage()
);
