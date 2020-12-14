<?php

namespace Getwid\Blocks;

class Counter extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/counter';

    public function __construct() {

        parent::__construct( self::$blockName );

        register_block_type(
            'getwid/counter',
            array(
                'render_callback' => [ $this, 'render_callback' ]
            )
		);

		if ( $this->isEnabled() ) {

			add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );

			//Register JS/CSS assets
			wp_register_script(
				'countup',
				getwid_get_plugin_url( 'vendors/countup.js/dist/countUp.min.js' ),
				[],
				'2.0.4',
				true
			);

			wp_register_script(
				'waypoints',
				getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
				[ 'jquery' ],
				'4.0.1',
				true
			);
		}
    }

	public function getLabel() {
		return __('Counter', 'getwid');
	}

    public function block_editor_scripts( $scripts ) {

		//countUp.min.js
		if ( ! in_array( 'countup', $scripts ) ) {
            array_push( $scripts, 'countup' );
        }

        return $scripts;
    }

    private function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		//jquery.waypoints.min.js
		if ( ! wp_script_is( 'waypoints', 'enqueued' ) ) {
			wp_enqueue_script('waypoints');
		}

		//countUp.min.js
		if ( ! wp_script_is( 'countup', 'enqueued' ) ) {
			wp_enqueue_script('countup');
		}
    }

    public function render_callback( $attributes, $content ) {

        $this->block_frontend_assets();

        return $content;
    }
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\Counter()
);
