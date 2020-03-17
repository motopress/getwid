<?php

namespace Getwid\Blocks;

class SocialLinks extends \Getwid\Blocks\AbstractBlock {

    private $blockName = 'getwid/social-links';

    public function __construct() {

		parent::__construct( $this->blockName );

        register_block_type(
            'getwid/social-links'
        );
    }
}

new \Getwid\Blocks\SocialLinks();
