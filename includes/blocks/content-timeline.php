<?php

namespace Getwid\Blocks;

class ContentTimeline extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/content-timeline' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/content-timeline/content-timeline' )
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/content-timeline/content-timeline-item' )
		);
	}

	public function get_label() {
		return __( 'Content Timeline', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new ContentTimeline()
);
