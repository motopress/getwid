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

	public function getLabel() {
		return __('Social Links', 'getwid');
	}
}

\Getwid\BlocksManager::getInstance()->addBlock(
	new \Getwid\Blocks\SocialLinks()
);
