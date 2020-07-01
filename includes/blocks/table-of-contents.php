<?php

namespace Getwid\Blocks;

class TableOfContents extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/table-of-contents';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/table-of-contents'
		);

		/**
		 * Rank Math ToC Plugins List.
		 */
		add_filter( 'rank_math/researches/toc_plugins', function( $toc_plugins ) {
			$toc_plugins['getwid/getwid.php'] = 'Getwid';
			return $toc_plugins;
		});

	}

	public function getLabel() {
		return __('Table of Contents', 'getwid');
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\TableOfContents()
);