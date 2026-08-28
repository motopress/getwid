<?php

namespace Getwid\Blocks\TemplateParts;

class PostDate extends \Getwid\Blocks\AbstractBlock {

	protected static $assets_handle = 'getwid/template-parts';

	public function __construct() {

		parent::__construct( 'getwid/template-post-date' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/template-parts/post-date' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Date', 'getwid' );
	}

	public function can_be_disabled() {
		return false;
	}

	public function render_callback( $attributes, $content ) {

		if ( ( get_post_type() === getwid()->postTemplatePart()->postType ) || ( get_post_type() === 'revision' ) ) {
			return $content;
		}

		$block_name    = 'wp-block-getwid-template-post-date';
		$wrapper_class = $block_name;
		$wrapper_style = '';

		if ( isset( $attributes['className'] ) ) {
			$wrapper_class .= ' ' . esc_attr( $attributes['className'] );
		}

		if ( isset( $attributes['textAlignment'] ) ) {
			$wrapper_style .= 'text-align: ' . esc_attr( $attributes['textAlignment'] ) . ';';
		}

		if ( isset( $attributes['bold'] ) && $attributes['bold'] ) {
			$wrapper_style .= 'font-weight: bold;';
		}

		if ( isset( $attributes['italic'] ) && $attributes['italic'] ) {
			$wrapper_style .= 'font-style: italic;';
		}

		if ( isset( $attributes['customFontSize'] ) ) {
			$font_size      = is_numeric( $attributes['customFontSize'] ) ? $attributes['customFontSize'] . 'px' : $attributes['customFontSize'];
			$wrapper_style .= 'font-size: ' . esc_attr( $font_size ) . ';';
		}

		if ( isset( $attributes['fontSize'] ) ) {
			$wrapper_class .= ' has-' . esc_attr( $attributes['fontSize'] ) . '-font-size';
		}

		$archive_year  = get_the_time( 'Y' );
		$archive_month = get_the_time( 'm' );
		$archive_day   = get_the_time( 'd' );
		$is_back_end   = getwid_is_block_editor();

		getwid_custom_color_style_and_class( $wrapper_style, $wrapper_class, $attributes, 'color', $is_back_end );

		$icon_class = '';
		$icon_style = '';

		getwid_custom_color_style_and_class(
			$icon_style,
			$icon_class,
			$attributes,
			'color',
			$is_back_end,
			array(
				'color'  => 'iconColor',
				'custom' => 'customIconColor',
			)
		);

		$result     = '';
		$extra_attr = array(
			'wrapper_class' => $wrapper_class,
			'wrapper_style' => $wrapper_style,
			'archive_year'  => $archive_year,
			'archive_month' => $archive_month,
			'archive_day'   => $archive_day,
			'icon_class'    => $icon_class,
			'icon_style'    => $icon_style,
		);

		if ( get_the_date() ) {
			ob_start();

			getwid_get_template_part( 'template-parts/post-date', $attributes, false, $extra_attr );

			$result = ob_get_clean();
		}

		return $result;
	}
}

getwid()->blocksManager()->addBlock(
	new PostDate()
);
