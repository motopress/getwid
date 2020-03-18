<?php

namespace Getwid\Blocks;

class SocialLinks extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/social-links';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            self::$blockName
        );
    }
}

new \Getwid\Blocks\SocialLinks();
