<?php

namespace Getwid\Blocks\TemplateParts;

class TemplatePostLayoutHelper extends \Getwid\Blocks\AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/template-post-layout-helper' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/template-parts/post-layout-helper' )
		);

		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
	}

	public function get_label() {
		return __( 'Layout', 'getwid' );
	}

	public function is_disabled() {
		return apply_filters( 'getwid/blocks/is_disabled', false, 'getwid/template-post-layout-helper' );
	}

	public function enqueue_editor_assets() {
		$data = array(
			'templates_name' => getwid()->postTemplatePart()->postType,
		);

		$inline_script = 'var Getwid = Getwid || {};';

		$inline_script .= 'Getwid["PostLayoutHelper"] = ' . wp_json_encode( $data ) . ';';

		wp_add_inline_script(
			'getwid-template-post-layout-helper-editor-script',
			$inline_script,
			'before'
		);
	}
}

getwid()->blocksManager()->addBlock(
	new TemplatePostLayoutHelper()
);
