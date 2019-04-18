<?php

namespace Getwid;

/**
 * Class BlocksManager
 * @package Getwid
 */
class BlocksManager {

	private $prefix;

	/**
	 * BlockManager constructor.	
	 *
	 * @param Settings $settings Plugin settings
	 *
	 */
	public function __construct( $settings ) {
		$this->prefix  = $settings->getPrefix();

		add_action( 'init', [$this, 'includeBlocks'] );
	}	

	public function includeBlocks(){
		$blocks = array(
			'recent-posts',
			'advanced-heading',
			'instagram',
			'post-carousel',
		);

		foreach ($blocks as $key => $block_name) {
			$path = getwid_get_plugin_path('/includes/blocks/'.$block_name.'.php');

			if (file_exists($path)){
				require_once($path);
			}
		}
	}
}