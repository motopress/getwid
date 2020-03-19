<?php

namespace Getwid\Blocks;

abstract class AbstractBlock {

	private $blockName;

    public function __construct( $blockName ) {
		$this->blockName = $blockName;
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

		$disabled = get_option( $this->getDisabledOptionKey(), false );
		return apply_filters( 'getwid/blocks/' . $this->getDisabledOptionKey(), $disabled);
	}
}
