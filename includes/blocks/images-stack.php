<?php

namespace Getwid\Blocks;

class ImagesStack extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/images-stack';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			self::$blockName
		);

	}

	public function getLabel() {
		return __('Image Stack Gallery', 'getwid');
	}
}

\Getwid\BlocksManager::getInstance()->addBlock(
	new \Getwid\Blocks\ImagesStack()
);
