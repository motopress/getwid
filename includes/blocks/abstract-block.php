<?php

namespace Getwid\Blocks;

class AbstractBlock {

    private $blockName = '';

    public function __construct( $blockName ) {
		$this->blockName = $blockName;
    }

	public function hasBlock() {
		return has_block( $this->blockName );
	}

}
