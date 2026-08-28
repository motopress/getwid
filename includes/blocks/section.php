<?php

namespace Getwid\Blocks;

class Section extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/section' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/section' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Section', 'getwid' );
	}

	public function block_frontend_assets( $attributes = array(), $content = '' ) {

		if ( is_admin() ) {
			return;
		}

		$has_background_slider = false !== strpos( $content, 'wp-block-getwid-section__background-slider-item' );

		if ( ! empty( $attributes['entranceAnimation'] ) ) {
			wp_enqueue_script( 'wow' );
			wp_enqueue_style( 'animate' );
		}

		if ( $has_background_slider ) {
			wp_enqueue_script( 'slick' );
			wp_enqueue_style( 'slick' );
			wp_enqueue_style( 'slick-theme' );
			wp_enqueue_script( 'imagesloaded' );
		}
	}

	public function render_callback( $attributes, $content ) {

		$this->block_frontend_assets( $attributes, $content );

		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new Section()
);
