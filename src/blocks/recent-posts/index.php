<?php

function render_getwid_recent_posts( $attributes ) {
    $args = array(
        'posts_per_page'   => $attributes['postsToShow'],
        'post_status'      => 'publish',
        'order'            => $attributes['order'],
        'orderby'          => $attributes['orderBy'],
        'suppress_filters' => false,
    );
    if ( isset( $attributes['categories'] ) ) {
        $args['category'] = $attributes['categories'];
    }
    $recent_posts = get_posts( $args );
    $list_items_markup = '';
    foreach ( $recent_posts as $post ) {
        $title = get_the_title( $post );
        if ( ! $title ) {
            $title = __( '(Untitled)' );
        }
        $list_items_markup .= sprintf(
            '<li><a href="%1$s">%2$s</a>',
            esc_url( get_permalink( $post ) ),
            esc_html( $title )
        );
        if ( isset( $attributes['displayPostDate'] ) && $attributes['displayPostDate'] ) {
            $list_items_markup .= sprintf(
                '<time datetime="%1$s" class="wp-block-getwid-recent-posts__post-date">%2$s</time>',
                esc_attr( get_the_date( 'c', $post ) ),
                esc_html( get_the_date( '', $post ) )
            );
        }
        $list_items_markup .= "</li>\n";
    }
    $class = 'wp-block-getwid-recent-posts lolo4ka';
    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['postLayout'] ) && 'grid' === $attributes['postLayout'] ) {
        $class .= ' is-grid';
    }
    if ( isset( $attributes['columns'] ) && 'grid' === $attributes['postLayout'] ) {
        $class .= ' columns-' . $attributes['columns'];
    }
    if ( isset( $attributes['displayPostDate'] ) && $attributes['displayPostDate'] ) {
        $class .= ' has-dates';
    }
    if ( isset( $attributes['className'] ) ) {
        $class .= ' ' . $attributes['className'];
    }
    $block_content = sprintf(
        '<ul class="%1$s">%2$s</ul>',
        esc_attr( $class ),
        $list_items_markup
    );
    return $block_content;
}

register_block_type(
    'getwid/recent-posts',
    array(
        'attributes'      => array(
            'categories'      => array(
                'type' => 'string',
            ),
            'className'       => array(
                'type' => 'string',
            ),
            'postsToShow'     => array(
                'type'    => 'number',
                'default' => 5,
            ),
            'displayPostDate' => array(
                'type'    => 'boolean',
                'default' => false,
            ),
            'postLayout'      => array(
                'type'    => 'string',
                'default' => 'list',
            ),
            'columns'         => array(
                'type'    => 'number',
                'default' => 3,
            ),
            'align'           => array(
                'type' => 'string',
            ),
            'order'           => array(
                'type'    => 'string',
                'default' => 'desc',
            ),
            'orderBy'         => array(
                'type'    => 'string',
                'default' => 'date',
            ),
        ),
        'render_callback' => 'render_getwid_recent_posts',
    )
);