<?php

namespace Getwid\Blocks;

class SocialLinks {

    private $blockName = 'getwid/social-links';

    public function __construct() {

        register_block_type(
            'getwid/social-links'
        );
    }
}

new \Getwid\Blocks\SocialLinks();