<?php

//Enqueue frontend-only block JS and CSS
function assets_getwid_media_text_slider(){
    if ( is_admin() ) {
        return;
    }

    if ( ! wp_script_is( 'slick', 'enqueued' ) ) {
        wp_enqueue_script(
            'slick',
            getwid_get_plugin_url( 'vendors/slick/slick/slick.min.js' ),
            [ 'jquery' ],
            '1.9.0',
            true
        );
    }

    if ( ! wp_style_is( 'slick', 'enqueued' ) ) {
        wp_enqueue_style(
            'slick',
            getwid_get_plugin_url( 'vendors/slick/slick/slick.min.css' ),
            [],
            '1.9.0'
        );
    }

    if ( ! wp_style_is( 'slick-theme', 'enqueued' ) ) {
        wp_enqueue_style(
            'slick-theme',
            getwid_get_plugin_url( 'vendors/slick/slick/slick-theme.min.css' ),
            [],
            '1.9.0'
        );
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

function render_getwid_media_text_slider( $attributes, $content ) {

    assets_getwid_media_text_slider();

    return $content;
}

register_block_type(
    'getwid/media-text-slider',
    array(
        'render_callback' => 'render_getwid_media_text_slider',
    )
);