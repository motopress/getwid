<?php

namespace Getwid\Blocks;

class AcfSelect extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/template-acf-select';
	protected static $assetsHandle = 'getwid/template-parts/acf';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			self::$blockName,
			array(
				'attributes' => array(
					'customField' => array(
						'type' => 'string'
					),
					'labelName' => array(
						'type' => 'string'
					),
					'separator' => array(
						'type' => 'string',
						'default' => ','
					),

					// Colors
					'textColor' => array(
						'type' => 'string'
					),
					'customTextColor' => array(
						'type' => 'string'
					),

					// Font
					'fontSize' => array(
						'type' => 'string'
					),
					'customFontSize' => array(
						'type' => 'number'
					),
					'bold' => array(
						'type' => 'boolean',
						'default' => false
					),
					'italic' => array(
						'type' => 'boolean',
						'default' => false
					),
					'textAlignment' => array(
						'type' => 'string'
					),

					'className' => array(
						'type' => 'string'
					),
				),
				'render_callback' => [$this, 'render_callback']
			)
		);
	}

	private function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		if ( FALSE == getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		add_filter( 'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = self::$assetsHandle;

				return $assets;
			}
		);

		wp_enqueue_style(
			self::$assetsHandle,
			getwid_get_plugin_url( 'assets/blocks/template-parts/acf/style.css' ),
			[],
			getwid()->settings()->getVersion()
		);
	}

	public function render_callback( $attributes, $content ) {

		//Not BackEnd render if we view from template page
		if ( (get_post_type() == getwid()->postTemplatePart()->postType) || (get_post_type() == 'revision') ) {
			return $content;
		}

		$block_name = 'wp-block-getwid-template-acf-select';
		$wrapper_class = $block_name;

		if ( isset( $attributes['className'] ) ) {
			$wrapper_class .= ' ' . esc_attr( $attributes['className'] );
		}

		if ( isset( $attributes['customField'] ) ) {
			$wrapper_class .= ' ' . 'custom-field-' . esc_attr( $attributes['customField'] );
		}

		$wrapper_style = '';

		// Font
		if ( isset( $attributes['textAlignment'] ) ) {
			$wrapper_style .= 'text-align: ' . esc_attr( $attributes['textAlignment'] ) . ';';
		}

		if ( isset( $attributes['bold'] ) && $attributes['bold'] ) {
			$wrapper_style .= 'font-weight: bold;';
		}

		if ( isset( $attributes['italic'] ) && $attributes['italic'] ) {
			$wrapper_style .= 'font-style: italic;';
		}

		// Link style & class
		if ( isset( $attributes['customFontSize'] ) ) {
			$wrapper_style .= 'font-size: ' . esc_attr( $attributes['customFontSize'] ) . 'px;';
		}

		if ( isset( $attributes['fontSize'] ) ) {
			$wrapper_class .= ' has-' . esc_attr( $attributes['fontSize'] ) . '-font-size';
		}

		$is_back_end = getwid_is_block_editor();

		getwid_custom_color_style_and_class( $wrapper_style, $wrapper_class, $attributes, 'color', $is_back_end );

		$result = '';

		$extra_attr = array(
			'wrapper_class' => $wrapper_class,
			'wrapper_style' => $wrapper_style,
		);

		if ( getwid_acf_is_active() && isset( $attributes['customField'] ) ) {
			ob_start();

			getwid_get_template_part( 'template-parts/acf/select', $attributes, false, $extra_attr );

			$result = ob_get_clean();
		}

		$this->block_frontend_assets();

		return $result;
	}
}

new \Getwid\Blocks\AcfSelect();
