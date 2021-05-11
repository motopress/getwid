<?php

namespace Getwid\Blocks;

class AcfWysiwyg extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/template-acf-wysiwyg';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			self::$blockName,
			array(
				'attributes' => array(
					'customField' => array(
						'type' => 'string'
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

	public function render_callback( $attributes, $content ) {

		//Not BackEnd render if we view from template page
		if ( (get_post_type() == getwid()->postTemplatePart()->postType) || (get_post_type() == 'revision') ) {
			return $content;
		}

		$block_name = 'wp-block-getwid-template-acf-wysiwyg';
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

		$is_back_end = \defined( 'REST_REQUEST' ) && REST_REQUEST && !empty( $_REQUEST['context'] ) && 'edit' === $_REQUEST['context'];

		getwid_custom_color_style_and_class( $wrapper_style, $wrapper_class, $attributes, 'color', $is_back_end );

		$result = '';

		$extra_attr = array(
			'wrapper_class' => $wrapper_class,
			'wrapper_style' => $wrapper_style,
		);

		if ( acf_is_active() && isset( $attributes['customField'] ) ) {
			ob_start();

			getwid_get_template_part( 'template-parts/acf/wysiwyg', $attributes, false, $extra_attr );

			$result = ob_get_clean();
		}

		return $result;
	}
}

new \Getwid\Blocks\AcfWysiwyg();
