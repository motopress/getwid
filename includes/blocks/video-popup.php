<?php

namespace Getwid\Blocks;

class VideoPopup extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/video-popup' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/video-popup' )
		);
	}

	public function get_label() {
		return __( 'Video Popup', 'getwid' );
	}
}

getwid()->blocksManager()->addBlock(
	new VideoPopup()
);
