<?php

namespace Getwid\Blocks;

class VideoPopup extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/video-popup' );

			wp_register_script(
				'mp-fancybox',
				getwid_get_plugin_url( 'vendors/mp-fancybox/jquery.fancybox.min.js' ),
				array( 'jquery' ),
				'3.5.7-mp.1',
				true
			);

			wp_register_style(
				'mp-fancybox',
				getwid_get_plugin_url( 'vendors/mp-fancybox/jquery.fancybox.min.css' ),
				array(),
				'3.5.7-mp.1'
			);

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
