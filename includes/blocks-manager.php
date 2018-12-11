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
			'icon',
		);

		foreach ($blocks as $key => $block_name) {
			$path = getwid_get_plugin_path().'/src/blocks/'.$block_name.'/index.php';

			if (file_exists($path)){
				require_once($path);
			}
		}
	}
}