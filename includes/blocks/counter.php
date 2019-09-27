<?php

//Enqueue frontend-only block JS and CSS
function assets_getwid_counter(){
    if ( is_admin() ) {
        return;
    }

    if ( ! wp_script_is( 'waypoints', 'enqueued' ) ) {
		wp_enqueue_script(
			'waypoints',
			getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
			[ 'jquery' ],
			'4.0.1',
			true
		);
    }

    if ( ! wp_script_is( 'countup', 'enqueued' ) ) {
		wp_enqueue_script(
			'countup',
			getwid_get_plugin_url( 'vendors/countup.js/dist/countUp.min.js' ),
			[],
			'2.0.4',
			true
		);
    }
}

function render_getwid_counter( $attributes, $content ) {

    assets_getwid_counter();

    return $content;
}

register_block_type(
    'getwid/counter',
    array(
        'render_callback' => 'render_getwid_counter',
    )
);