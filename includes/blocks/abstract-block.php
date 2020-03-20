<?php

namespace Getwid\Blocks;

abstract class AbstractBlock {

	private $blockName;

    public function __construct( $blockName ) {

		$this->blockName = $blockName;

		if ( $this->isDisabled() ) {

			gLog( $this->getDisabledOptionKey(), $this->isDisabled() );

			// https://developer.wordpress.org/reference/functions/render_block/
			add_filter( 'pre_render_block', [ $this, 'pre_render_block' ], 10, 2 );

			/**
			 * https://developer.wordpress.org/block-editor/developers/filters/block-filters/
			 * wp.blocks.unregisterBlockType( 'getwid/accordion' );
			 * throws 'TypeError: "ke is undefined"'
			 * https://github.com/WordPress/gutenberg/issues/12484
			 */
			//add_filter( 'allowed_block_types', [ $this, 'allowed_block_types' ], 10, 2 );
		}
    }

	/**
	 * Assets optimization. Currently in Beta.
	 * @since 1.5.3
	 */
	public function hasBlock() {
		return has_block( $this->blockName ) || is_admin();
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

	public function pre_render_block( $block_content = null, $block ) {

		if ( $block['blockName'] === static::$blockName ) {

			$block_content = '<!-- ' . $block['blockName'] . ' block is disabled -->' . PHP_EOL;

			if ( current_user_can('manage_options') ) {
				$block_content .= '<p>';
				$block_content .=  sprintf(
					__( '%1$s block is disabled in plugin setting. <a href="%2$s">Manage Blocks</a>', 'getwid'),
					$this->getLabel(),
					esc_url( admin_url('options-writing.php') )
				);
				$block_content .= '</p>';
			}
		}

		return $block_content;
	}

	public function allowed_block_types( $allowed_block_types, $post ) {

		//https://github.com/WordPress/gutenberg/issues/12931
		$get_all_registered = \WP_Block_Type_Registry::get_instance()->get_all_registered();
		$registered_blocks = [];

		foreach ( $get_all_registered as $key => $value) {
			$registered_blocks[] = $key;
		}

		$allowed_blocks = array_diff(
			$registered_blocks, // NOTE registered blocks does NOT contains all blocks
			array( static::$blockName )
		);

		return $allowed_blocks;
	}
}
