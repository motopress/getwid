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
}
