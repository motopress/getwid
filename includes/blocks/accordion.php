<?php

//Enqueue frontend-only block JS and CSS
function assets_getwid_accordion(){
    if ( is_admin() ) {
        return;
    }

    if ( ! wp_script_is( 'jquery-ui-accordion', 'enqueued' ) ) {
        wp_enqueue_script('jquery-ui-accordion');
    }
}

function render_getwid_accordion( $attributes, $content ) {

    assets_getwid_accordion();

    return $content;
}

register_block_type(
    'getwid/accordion',
    array(
        'render_callback' => 'render_getwid_accordion',
    )
);