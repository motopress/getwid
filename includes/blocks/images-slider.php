<?php

//Enqueue frontend-only block JS and CSS
function assets_getwid_images_slider(){
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
}

function render_getwid_images_slider( $attributes, $content ) {

    assets_getwid_images_slider();

    return $content;
}

register_block_type(
    'getwid/images-slider',
    array(
        'render_callback' => 'render_getwid_images_slider',
    )
);