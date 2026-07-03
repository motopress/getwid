<?php

namespace Getwid\Blocks\TemplateParts;

class PostTitle extends \Getwid\Blocks\AbstractBlock {

	protected static $assets_handle = 'getwid/template-parts';

	public function __construct() {

		parent::__construct( 'getwid/template-post-title' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/template-parts/post-title' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Title', 'getwid' );
	}

	public function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		if ( false === getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		add_filter(
			'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = self::$assets_handle;

				return $assets;
			}
		);

		$rtl = is_rtl() ? '.rtl' : '';

		wp_enqueue_style(
			self::$assets_handle,
			getwid_get_plugin_url( 'assets/blocks/template-parts/style' . $rtl . '.css' ),
			array(),
			getwid()->settings()->getVersion()
		);
	}

	public function render_callback( $attributes, $content ) {

		if ( ( get_post_type() === getwid()->postTemplatePart()->postType ) || ( get_post_type() === 'revision' ) ) {
			return $content;
		}

		$block_name  = 'wp-block-getwid-template-post-title';
		$title_style = '';
		$title_class = $block_name;

		if ( isset( $attributes['className'] ) ) {
			$title_class .= ' ' . esc_attr( $attributes['className'] );
		}

		if ( isset( $attributes['textAlignment'] ) ) {
			$title_style .= 'text-align: ' . esc_attr( $attributes['textAlignment'] ) . ';';
		}

		$is_back_end = getwid_is_block_editor();
		$link_class  = esc_attr( $block_name ) . '__link';

		if ( isset( $attributes['bold'] ) && $attributes['bold'] ) {
			$title_style .= 'font-weight: bold;';
		}

		if ( isset( $attributes['italic'] ) && $attributes['italic'] ) {
			$title_style .= 'font-style: italic;';
		}

		if ( isset( $attributes['customFontSize'] ) ) {
			$font_size    = is_numeric( $attributes['customFontSize'] ) ? $attributes['customFontSize'] . 'px' : $attributes['customFontSize'];
			$title_style .= 'font-size: ' . esc_attr( $font_size ) . ';';
		}

		if ( isset( $attributes['fontSize'] ) ) {
			$title_class .= ' has-' . esc_attr( $attributes['fontSize'] ) . '-font-size';
		}

		getwid_custom_color_style_and_class( $title_style, $title_class, $attributes, 'color', $is_back_end );

		$result     = '';
		$header_tag = $this->validate_heading_html_tag( $attributes['headerTag'] );

		$extra_attr = array(
			'headerTag'   => $header_tag,
			'title_style' => $title_style,
			'title_class' => $title_class,
			'link_class'  => $link_class,
		);

		if ( get_the_title() ) {
			ob_start();

			getwid_get_template_part( 'template-parts/post-title', $attributes, false, $extra_attr );

			$result = ob_get_clean();
		}

		$this->block_frontend_assets();

		return $result;
	}
}

getwid()->blocksManager()->addBlock(
	new PostTitle()
);
