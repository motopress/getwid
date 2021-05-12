<?php

namespace Getwid\Blocks;

class Tabs extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/tabs';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            'getwid/tabs',
            array(
                'render_callback' => [ $this, 'render_callback' ]
            )
        );

		if ( $this->isEnabled() ) {

			add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );
		}
    }

	public function getLabel() {
		return __('Tabs', 'getwid');
	}

    public function block_editor_scripts($scripts) {

        //jquery-ui-tabs.min.js
		if ( ! in_array( 'jquery-ui-tabs', $scripts ) ) {
            array_push( $scripts, 'jquery-ui-tabs' );
        }

        return $scripts;
    }

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }

		//jquery-ui-tabs.min.js
        if ( ! wp_script_is( 'jquery-ui-tabs', 'enqueued' ) ) {
            wp_enqueue_script('jquery-ui-tabs');
        }

		if ( FALSE == getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		wp_enqueue_style(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/tabs/style.css' ),
			[],
			getwid()->settings()->getVersion()
		);

		wp_enqueue_script(
            self::$blockName,
            getwid_get_plugin_url( 'assets/blocks/tabs/frontend.js' ),
            [ 'jquery', 'jquery-ui-tabs' ],
            getwid()->settings()->getVersion(),
            true
        );

    }

    public function render_callback( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\Tabs()
);
