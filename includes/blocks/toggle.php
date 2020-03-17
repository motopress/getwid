<?php

namespace Getwid\Blocks;

class Toggle extends \Getwid\Blocks\AbstractBlock {

    private $blockName = 'getwid/toggle';

    public function __construct() {

		parent::__construct( $this->blockName );

        register_block_type(
            'getwid/toggle'
        );
    }
}

new \Getwid\Blocks\Toggle();
