<?php

//Enqueue frontend-only block JS and CSS
function assets_getwid_circle_progress_bar(){
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
}

function render_getwid_circle_progress_bar( $attributes, $content ) {

    assets_getwid_circle_progress_bar();

    return $content;
}

register_block_type(
    'getwid/circle-progress-bar',
    array(
        'render_callback' => 'render_getwid_circle_progress_bar',
    )
);