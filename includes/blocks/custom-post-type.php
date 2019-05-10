<?php

function render_getwid_custom_post_type( $attributes ) {

    $query_args = array(
        'posts_per_page'   => $attributes['postsToShow'],
        'ignore_sticky_posts' => 1,
        'post_status'      => 'publish',
        'order'            => $attributes['order'],
        'orderby'          => $attributes['orderBy'],
    );

    //Custom Post Type
    if ( isset($attributes['customPostTypes']) &&  isset($attributes['customTaxonomy']) && isset($attributes['customTerms']) ){
        $query_args['post_type'] = $attributes['customPostTypes'];
        $query_args['tax_query'] = array(
            array(
                'taxonomy' => $attributes['customTaxonomy'],
                'field' => 'term_id',
                'terms' => $attributes['customTerms']
            )
        );
    }
    //Custom Post Type

    $block_name = 'wp-block-getwid-recent-posts';

    $extra_attr = array(
        'block_name' => $block_name
    );

    $class = $block_name;

    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['postLayout'] ) ) {
        $class .= " has-layout-{$attributes['postLayout']}";
    }
    if ( isset( $attributes['showPostDate'] ) && $attributes['showPostDate'] ) {
        $class .= ' has-dates';
    }
    if ( isset( $attributes['className'] ) ) {
        $class .= ' ' . $attributes['className'];
    }
	if( isset( $attributes['cropImages'] ) && $attributes['cropImages'] === true ){
		$class .= ' has-cropped-images';
	}

    $wrapper_class = $block_name.'__wrapper';

    if ( isset( $attributes['columns'] ) && $attributes['postLayout'] === 'grid' ) {
        $wrapper_class .= " getwid-columns getwid-columns-" . $attributes['columns'];
    }

    $q = new WP_Query( $query_args );
    ob_start();
    ?>    

    <div class="<?php echo esc_attr( $class ); ?>">
        <div class="<?php echo esc_attr( $wrapper_class );?>">
            <?php
            if ( $q->have_posts() ):
                ob_start();
                while( $q->have_posts() ):
                    $q->the_post();
                    getwid_get_template_part('custom-post-type/post', $attributes, false, $extra_attr);
                endwhile;
                ob_end_flush();
            endif;
            ?>
        </div>
    </div>
    <?php
	wp_reset_postdata();

    $result = ob_get_clean();
    return $result;
}

register_block_type(
    'getwid/custom-post-type',
    array(
        'attributes' => array(
            //Custom Post Type
            'customPostTypes' => array(
                'type' => 'string',
            ),  
            'customTaxonomy' => array(
                'type' => 'string',
            ),
            'customTerms' => array(
                'type' => 'array',
                'items'   => [
                    'type' => 'integer',
                ],
            ),            
            //Custom Post Type
            
            'titleTag' => array(
                'type' => 'string',
                'default' => 'h3',
            ),            
            'imageSize' => array(
                'type' => 'string',
                'default' => 'large',
            ),
			'cropImages' => array(
				'type' => 'boolean',
				'default' => true,
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
            'showCommentsCount' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'showContent' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'contentLength' => array(
                'type' => 'number',
                'default' => apply_filters('excerpt_length', 55),
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
        'render_callback' => 'render_getwid_custom_post_type',
    )
);