<?php

function render_getwid_recent_posts( $attributes ) {

    $query_args = array(
        'posts_per_page'   => $attributes['postsToShow'],
        'ignore_sticky_posts' => 1,
        'post_status'      => 'publish',
        'order'            => $attributes['order'],
        'orderby'          => $attributes['orderBy'],
    );

    if ( isset( $attributes['categories'] ) ) {
        $query_args['tax_query'] = array(
            array(
                'taxonomy' => 'category',
                'field' => 'id',
                'terms' => $attributes['categories']
            )
        );
    }

    $block_name = 'wp-block-getwid-recent-posts';

    $extra_attr = array(
        'block_name' => $block_name
    );

    $class = $block_name;
    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['postLayout'] ) ) {
        $class .= " $block_name--layout-{$attributes['postLayout']}";
    }
    if ( isset( $attributes['columns'] ) && $attributes['postLayout'] === 'grid' ) {
        $class .= " getwid-columns-" . $attributes['columns'];
    }
    if ( isset( $attributes['showPostDate'] ) && $attributes['showPostDate'] ) {
        $class .= ' has-dates';
    }
    if ( isset( $attributes['className'] ) ) {
        $class .= ' ' . $attributes['className'];
    }

    $q = new WP_Query( $query_args );

    ob_start();
    ?>    

    <div class="<?php echo esc_attr( $class ); ?>">
        <?php
        if ( $q->have_posts() ):
            ob_start();
            while( $q->have_posts() ):
                $q->the_post();
                getwid_get_template_part('recent-posts\post', $attributes, false, $extra_attr);
            endwhile;
            wp_reset_postdata();
            ob_end_flush();
        endif;
        ?>
    </div>
    <?

    $result = ob_get_clean();
    return $result;
}

register_block_type(
    'getwid/recent-posts',
    array(
        'attributes' => array(
            'titleTag' => array(
                'type' => 'string',
                'default' => 'span',
            ),            
            'imageSize' => array(
                'type' => 'string',
                'default' => 'post-thumbnail',
            ),
            'categories' => array(
                'type' => 'string',
            ),
            'className' => array(
                'type' => 'string',
            ),
            'postsToShow' => array(
                'type' => 'number',
                'default' => 5,
            ),
            'showTitle' => array(
                'type' => 'boolean',
                'default' => true,
            ),            
            'showDate' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'showCategories' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'showTags' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'showAuthor' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'showCommentsCount' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'showContent' => array(
                'type' => 'string',
                'default' => 'none',
            ),
            'showFeaturedImage' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'postLayout' => array(
                'type' => 'string',
                'default' => 'list',
            ),
            'columns' => array(
                'type' => 'number',
                'default' => 3,
            ),
            'align' => array(
                'type' => 'string',
            ),
            'order' => array(
                'type' => 'string',
                'default' => 'desc',
            ),
            'orderBy' => array(
                'type' => 'string',
                'default' => 'date',
            ),
        ),
        'render_callback' => 'render_getwid_recent_posts',
    )
);