<?php

namespace Getwid\Blocks;

class Testimonial extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/testimonial';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			self::$blockName
		);

	}

	public function getLabel() {
		return __('Testimonial', 'getwid');
	}
}

\Getwid\BlocksManager::getInstance()->addBlock(
	new \Getwid\Blocks\Testimonial()
);
