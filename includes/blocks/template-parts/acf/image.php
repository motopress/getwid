<?php

namespace Getwid\Blocks\TemplateParts\Acf;

class AcfImage extends \Getwid\Blocks\AbstractBlock {

	protected static $assets_handle = 'getwid/template-parts/acf';

	public function __construct() {

		parent::__construct( 'getwid/template-acf-image' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/template-parts/acf/image' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'ACF Image', 'getwid' );
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
			getwid_get_plugin_url( 'assets/blocks/template-parts/acf/style' . $rtl . '.css' ),
			array(),
			getwid()->settings()->getVersion()
		);
	}

	public function render_callback( $attributes, $content ) {

		if ( ( get_post_type() === getwid()->postTemplatePart()->postType ) || ( get_post_type() === 'revision' ) ) {
			return $content;
		}

		$block_name    = 'wp-block-getwid-template-acf-image';
		$wrapper_class = $block_name;

		if ( isset( $attributes['className'] ) ) {
			$wrapper_class .= ' ' . esc_attr( $attributes['className'] );
		}

		if ( isset( $attributes['customField'] ) ) {
			$wrapper_class .= ' custom-field-' . esc_attr( $attributes['customField'] );
		}

		if ( isset( $attributes['align'] ) ) {
			$wrapper_class .= ' align' . esc_attr( $attributes['align'] );
		}

		$image_size = ( isset( $attributes['imageSize'] ) && $attributes['imageSize'] ) ? $attributes['imageSize'] : 'post-thumbnail';
		$result     = '';
		$extra_attr = array(
			'wrapper_class' => $wrapper_class,
			'imageSize'     => $image_size,
		);

		if ( getwid_acf_is_active() && isset( $attributes['customField'] ) ) {
			ob_start();

			getwid_get_template_part( 'template-parts/acf/image', $attributes, false, $extra_attr );

			$result = ob_get_clean();
		}

		$this->block_frontend_assets();

		return $result;
	}
}

getwid()->blocksManager()->addBlock(
	new AcfImage()
);
