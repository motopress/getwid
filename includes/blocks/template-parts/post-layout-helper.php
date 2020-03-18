<?php

namespace Getwid\Blocks;

class TemplatePostLayoutHelper extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/template-post-layout-helper';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			self::$blockName
		);

	}
}

new \Getwid\Blocks\TemplatePostLayoutHelper();
