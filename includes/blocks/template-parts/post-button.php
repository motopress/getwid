<?php

namespace Getwid\Blocks\New\TemplateParts;

class PostButton extends \Getwid\Blocks\New\AbstractBlock {

	protected static $assets_handle = 'getwid/template-parts';

	public function __construct() {

		parent::__construct( 'getwid/template-post-button' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/template-parts/post-button' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Button', 'getwid' );
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

		$block_name     = 'wp-block-getwid-template-post-button';
		$wrapper_class  = $block_name;
		$wrapper_class .= ' wp-block-button';
		$wrapper_style  = '';

		if ( isset( $attributes['className'] ) ) {
			$wrapper_class .= ' ' . esc_attr( $attributes['className'] );
		}

		if ( isset( $attributes['textAlignment'] ) ) {
			$wrapper_style .= 'text-align: ' . esc_attr( $attributes['textAlignment'] ) . ';';
		}

		$is_back_end = getwid_is_block_editor();
		$link_style  = '';
		$link_class  = 'wp-block-button__link';

		getwid_custom_color_style_and_class( $link_style, $link_class, $attributes, 'background', $is_back_end );
		getwid_custom_color_style_and_class( $link_style, $link_class, $attributes, 'color', $is_back_end );

		$extra_attr = array(
			'wrapper_class' => $wrapper_class,
			'wrapper_style' => $wrapper_style,
			'link_class'    => $link_class,
			'link_style'    => $link_style,
		);

		ob_start();

		getwid_get_template_part( 'template-parts/post-button', $attributes, false, $extra_attr );

		$result = ob_get_clean();

		$this->block_frontend_assets();

		return $result;
	}
}

getwid()->blocksManager()->addBlock(
	new PostButton()
);
