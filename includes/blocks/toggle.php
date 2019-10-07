<?php

namespace Getwid\Blocks;

class Toggle {

    private $blockName = 'getwid/toggle';

    public function __construct() {

        register_block_type(
            $this->blockName
        );
    }   
}

new \Getwid\Blocks\Toggle();