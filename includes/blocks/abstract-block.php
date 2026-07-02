<?php

namespace Getwid\Blocks\New;

abstract class AbstractBlock {

	protected $block_name;

	public function __construct( $block_name ) {

		$this->block_name = $block_name;

		if ( $this->is_disabled() ) {

			// https://developer.wordpress.org/reference/functions/render_block/
			add_filter( 'pre_render_block', array( $this, 'pre_render_block' ), 10, 2 );
		}
	}

	/**
	 * Assets optimization. Currently in Beta.
	 * @since 1.5.3
	 */
	public function has_block() {

		/**
		 * has_block doesn't return true when a block is inside a reusable block
		 * https://github.com/WordPress/gutenberg/issues/18272
		 */

		$has_block = has_block( $this->block_name );

		/**
		 * Determines whether a $post contains a specific block.
		 */
		return apply_filters( 'getwid/blocks/has_block', $has_block, $this->block_name );
	}

	public function get_block_name() {
		return $this->block_name;
	}

	public function get_label() {
		return $this->block_name;
	}

	public function get_disabled_option_key() {
		return $this->block_name . '::disabled';
	}

	public function is_disabled() {

		$disabled = rest_sanitize_boolean( get_option( $this->get_disabled_option_key(), false ) );

		getwid_maybe_add_option( $this->get_disabled_option_key(), false, true );

		return apply_filters( 'getwid/blocks/is_disabled', $disabled, $this->block_name );
	}

	public function is_enabled() {

		return ! $this->is_disabled();
	}

	public function pre_render_block( $block_content, $block ) {

		if ( $block['blockName'] === $this->block_name ) {

			$block_content = '<!-- ' . esc_html( $block['blockName'] ) . ' block is disabled -->' . PHP_EOL;

			if ( current_user_can( 'manage_options' ) ) {
				$block_content .= '<p>';
				$block_content .= sprintf(
					// translators: %1$s is a block name, %2$s is a link
					__( '%1$s block is disabled in plugin settings. <a href="%2$s">Manage Blocks</a>', 'getwid' ),
					esc_html( $this->get_label() ),
					esc_url( getwid()->settingsPage()->getTabUrl( 'blocks' ) )
				);
				$block_content .= '</p>';
			}
		}

		return $block_content;
	}

	protected function validate_heading_html_tag( $tag ) {

		$allowed_tags = array(
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'span',
			'p',
		);

		return in_array( strtolower( $tag ), $allowed_tags ) ? $tag : 'span';
	}
}
