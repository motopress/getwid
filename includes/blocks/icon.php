<?php

//Enqueue frontend-only block JS and CSS
function assets_getwid_icon(){
    if ( is_admin() ) {
        return;
    }

    if ( ! wp_style_is( 'animate', 'enqueued' ) ) {
		wp_enqueue_style(
			'animate',
			getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
			[],
			'3.7.0'
		);
    }
}

function render_getwid_icon( $attributes, $content ) {

    assets_getwid_icon();

    return $content;
}

register_block_type(
    'getwid/icon',
    array(
        'render_callback' => 'render_getwid_icon',
    )
);