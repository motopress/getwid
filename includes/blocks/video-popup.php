<?php

//Enqueue frontend-only block JS and CSS
function assets_getwid_video_popup(){
    if ( is_admin() ) {
        return;
    }

    if ( ! wp_style_is( 'magnific-popup', 'enqueued' ) ) {
		wp_enqueue_script(
			'magnific-popup',
			getwid_get_plugin_url( 'vendors/magnific-popup/jquery.magnific-popup.min.js' ),
			[ 'jquery' ],
			'1.1.0',
			true
		);
    }

    if ( ! wp_style_is( 'magnific-popup', 'enqueued' ) ) {
		wp_enqueue_style(
			'magnific-popup',
			getwid_get_plugin_url( 'vendors/magnific-popup/magnific-popup.css' ),
			[],
			'1.1.0'
		);
    }
}

function render_getwid_video_popup( $attributes, $content ) {

    assets_getwid_video_popup();

    return $content;
}

register_block_type(
    'getwid/video-popup',
    array(
        'render_callback' => 'render_getwid_video_popup',
    )
);