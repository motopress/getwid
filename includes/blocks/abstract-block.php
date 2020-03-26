<?php

namespace Getwid\Blocks;

abstract class AbstractBlock {

	private $blockName;

    public function __construct( $blockName ) {

		$this->blockName = $blockName;

		if ( $this->isDisabled() ) {

			getwid_log( $this->getDisabledOptionKey(), $this->isDisabled() );

			// https://developer.wordpress.org/reference/functions/render_block/
			add_filter( 'pre_render_block', [ $this, 'pre_render_block' ], 10, 2 );
		}
    }

	/**
	 * Assets optimization. Currently in Beta.
	 * @since 1.5.3
	 */
	public function hasBlock() {
		return has_block( $this->blockName );
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

		return apply_filters( 'getwid/blocks/' . $this->getDisabledOptionKey(), $disabled);
	}

	public function isEnabled() {

		return ! $this->isDisabled();
	}

	public function pre_render_block( $block_content = null, $block ) {

		if ( $block['blockName'] === static::$blockName ) {

			$block_content = '<!-- ' . $block['blockName'] . ' block is disabled -->' . PHP_EOL;

			if ( current_user_can('manage_options') ) {
				$block_content .= '<p>';
				$block_content .=  sprintf(
					__( '%s block is disabled in plugin settings. <a href="%s">Manage Blocks</a>', 'getwid'),
					$this->getLabel(),
					esc_url( admin_url('options-writing.php') )
				);
				$block_content .= '</p>';
			}
		}

		return $block_content;
	}
}
