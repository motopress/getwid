<?php

function render_getwid_post_title( $attributes ) {
	return the_title( '<h2>', '</h2>', false );
}

register_block_type(
    'getwid/post-title',
    array(
        'render_callback' => 'render_getwid_post_title',
    )
);