<?php

if ( ! function_exists( 'getwid_blocks_no_items_found' ) ) :
	/*
	 * Displays message when there are no posts to display
	 */
	function getwid_blocks_no_items_found( $attributes, $content ) {
		echo '<p>' . esc_html__( 'Nothing found.', 'getwid' ) . '</p>';
	}
endif;

add_action( 'getwid/blocks/post-slider/no-items', 'getwid_blocks_no_items_found', 10, 2 );
add_action( 'getwid/blocks/custom-post-type/no-items', 'getwid_blocks_no_items_found', 10, 2 );
add_action( 'getwid/blocks/post-carousel/no-items', 'getwid_blocks_no_items_found', 10, 2 );
add_action( 'getwid/blocks/recent-posts/no-items', 'getwid_blocks_no_items_found', 10, 2 );
