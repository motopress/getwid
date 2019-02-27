<?php

function render_getwid_advanced_heading( $attributes, $content ) {
    if ( isset( $attributes['fontWeight'] ) && $attributes['fontWeight'] == 'regular') {
        $attributes['fontWeight'] = '400';
    }

    if ( isset( $attributes['fontFamily'] ) ) {
        wp_enqueue_style(
            "google-font-".esc_attr(strtolower(preg_replace('/\s+/', '_', $attributes['fontFamily']))).(isset( $attributes['fontWeight'] ) && $attributes['fontWeight'] != '400' ? "_".esc_attr($attributes['fontWeight']) : ""),
            "https://fonts.googleapis.com/css?family=".esc_attr($attributes['fontFamily']).(isset( $attributes['fontWeight'] ) && $attributes['fontWeight'] != '400' ? ":".esc_attr($attributes['fontWeight']) : ""),
            null,
            'all'
        );
    }
    return $content;
}

register_block_type(
    'getwid/advanced-heading',
    array(
        'render_callback' => 'render_getwid_advanced_heading',
    )
);