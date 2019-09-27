<?php

//Enqueue frontend-only block JS and CSS
function assets_getwid_image_hotspot(){
    if ( is_admin() ) {
        return;
    }

    if ( ! wp_script_is( 'popper', 'enqueued' ) ) {
		wp_enqueue_script(
			'popper',
			getwid_get_plugin_url( 'vendors/tippy.js/popper.min.js' ),
			[ 'jquery' ],
			'1.15.0',
			true
		);
    }

    if ( ! wp_script_is( 'tippy', 'enqueued' ) ) {
		wp_enqueue_script(
			'tippy',
			getwid_get_plugin_url( 'vendors/tippy.js/index.all.min.js' ),
			[ 'jquery', 'popper' ],
			'4.3.5',
			true
		);
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

    if ( ! wp_style_is( 'tippy-themes', 'enqueued' ) ) {
		wp_enqueue_style(
			'tippy-themes',
			getwid_get_plugin_url( 'vendors/tippy.js/themes.css' ),
			[],
			'4.3.5'
		);
    }    
}

function render_getwid_image_hotspot( $attributes, $content ) {

    assets_getwid_image_hotspot();

    return $content;
}

register_block_type(
    'getwid/image-hotspot',
    array(
        'render_callback' => 'render_getwid_image_hotspot',
    )
);