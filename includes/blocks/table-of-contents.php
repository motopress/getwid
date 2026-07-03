<?php

namespace Getwid\Blocks;

class TableOfContents extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/table-of-contents' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/table-of-contents' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);

		/**
		 * Rank Math ToC Plugins List.
		 */
		add_filter(
			'rank_math/researches/toc_plugins',
			function ( $toc_plugins ) {
				$toc_plugins['getwid/getwid.php'] = 'Getwid';

				return $toc_plugins;
			}
		);
	}

	public function get_label() {
		return __( 'Table of Contents', 'getwid' );
	}

	public function render_callback( $attributes, $content ) {
		return $content;
	}
}

getwid()->blocksManager()->addBlock(
	new TableOfContents()
);
