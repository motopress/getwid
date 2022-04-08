<?php

namespace Getwid\Blocks;

abstract class AbstractBlock {

	private $blockName;

    public function __construct( $blockName ) {

		$this->blockName = $blockName;

		if ( $this->isDisabled() ) {

			// https://developer.wordpress.org/reference/functions/render_block/
			add_filter( 'pre_render_block', [ $this, 'pre_render_block' ], 10, 2 );
		}
    }

	/**
	 * Assets optimization. Currently in Beta.
	 * @since 1.5.3
	 */
	public function hasBlock() {

		/**
		 * has_block doesn't return true when a block is inside a reusable block
		 * https://github.com/WordPress/gutenberg/issues/18272
		 */

		$has_block = has_block( $this->blockName );

		return apply_filters( 'getwid/blocks/has_block', $has_block, $this->blockName );
	}

	public static function getBlockName() {
		return static::$blockName;
	}

	public function getLabel() {
		return static::$blockName;
	}

	public function getDisabledOptionKey() {
		return $this->blockName . '::disabled';
	}

	public function isDisabled() {

		$disabled = rest_sanitize_boolean( get_option( $this->getDisabledOptionKey(), false ) );

		getwid_maybe_add_option( $this->getDisabledOptionKey(), false, true );

		return apply_filters( 'getwid/blocks/is_disabled', $disabled, $this->blockName );
	}

	public function isEnabled() {

		return ! $this->isDisabled();
	}

	public function pre_render_block( $block_content, $block ) {

		if ( $block['blockName'] === static::$blockName ) {

			$block_content = '<!-- ' . esc_html( $block['blockName'] ) . ' block is disabled -->' . PHP_EOL;

			if ( current_user_can('manage_options') ) {
				$block_content .= '<p>';
				$block_content .=  sprintf(
					//translators: %1$s is a block name, %2$s is a link
					__( '%1$s block is disabled in plugin settings. <a href="%2$s">Manage Blocks</a>', 'getwid'),
					esc_html( $this->getLabel() ),
					esc_url( getwid()->settingsPage()->getTabUrl('blocks') )
				);
				$block_content .= '</p>';
			}
		}

		return $block_content;
	}
}
