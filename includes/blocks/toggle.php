<?php

namespace Getwid\Blocks;

class Toggle {

    public $blockName = 'getwid/toggle';

    public function __construct() {

        register_block_type(
            'getwid/toggle'
        );
    }   
}

new \Getwid\Blocks\Toggle();