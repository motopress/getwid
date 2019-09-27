<?php

//Enqueue frontend-only block JS and CSS
function assets_getwid_tabs(){
    if ( is_admin() ) {
        return;
    }

    if ( ! wp_script_is( 'jquery-ui-tabs', 'enqueued' ) ) {
        wp_enqueue_script('jquery-ui-tabs');
    }
}

function render_getwid_tabs( $attributes, $content ) {

    assets_getwid_tabs();

    return $content;
}

register_block_type(
    'getwid/tabs',
    array(
        'render_callback' => 'render_getwid_tabs',
    )
);