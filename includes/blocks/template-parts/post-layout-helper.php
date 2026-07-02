<?php

namespace Getwid\Blocks\New\TemplateParts;

class TemplatePostLayoutHelper extends \Getwid\Blocks\New\AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/template-post-layout-helper' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/template-parts/post-layout-helper' )
		);
	}

	public function get_label() {
		return __( 'Layout', 'getwid' );
	}

	public function isDisabled() {
		return apply_filters( 'getwid/blocks/is_disabled', false, 'getwid/template-post-layout-helper' );
	}
}

getwid()->blocksManager()->addBlock(
	new TemplatePostLayoutHelper()
);
