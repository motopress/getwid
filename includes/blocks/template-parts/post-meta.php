<?php

namespace Getwid\Blocks\New\TemplateParts;

class PostMeta extends \Getwid\Blocks\New\AbstractBlock {

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

		$this->block_frontend_assets();

		return $result;
	}
}

getwid()->blocksManager()->addBlock(
	new PostMeta()
);
