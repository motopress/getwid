<?php

namespace Getwid\Blocks;

class TableOfContents extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/table-of-contents';

	public function __construct() {

		parent::__construct( self::$blockName );

		register_block_type(
			'getwid/table-of-contents',
			array(
				'render_callback' => [ $this, 'render_callback' ]
			)
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

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }

		if ( FALSE == getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		wp_enqueue_style(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/table-of-contents/style.css' ),
			[],
			getwid()->settings()->getVersion()
		);
    }

	public function render_callback( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }

}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\TableOfContents()
);
