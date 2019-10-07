<?php

namespace Getwid\Blocks;

class SocialLinks {

    private $blockName = 'getwid/social-links';

    public function __construct() {

        register_block_type(
            $this->blockName
        );
    }
}

new \Getwid\Blocks\SocialLinks();