<?php

namespace Getwid\Blocks;

class ContentTimeline extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/content-timeline';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/content-timeline'
		);

	}

	public function getLabel() {
		return __('Content Timeline', 'getwid');
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\ContentTimeline()
);
