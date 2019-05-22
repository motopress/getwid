<?php

function render_getwid_custom_post_type( $attributes ) {

    //Custom Post Type
    $query_args = [];
    if ( isset($attributes['postType'])){

        $query_args = array(
            'post_type' => $attributes['postType'],
            'posts_per_page'   => $attributes['postsToShow'],
            'ignore_sticky_posts' => 1,
            'post_status'      => 'publish',
            'order'            => $attributes['order'],
            'orderby'          => $attributes['orderBy'],
        );

        if ( isset($attributes['taxonomy']) && isset($attributes['terms']) ){

            $query_args['tax_query'] = array(
                'relation' => $attributes['relation'],
            );

            $taxonomy_arr = [];

            //Get terms from taxonomy (Make arr)
            foreach ($attributes['terms'] as $key => $value) {
                preg_match('/(^.*)\[(\d*)\]/', $value, $find_arr);

                if (isset($find_arr[1]) && isset($find_arr[2])){
                    
                    $taxonomy = $find_arr[1];
                    $term = $find_arr[2];

                    $taxonomy_arr[$taxonomy][] = $term;

                }
            }

            //Add array to query
            if (!empty($taxonomy_arr)){
                foreach ($taxonomy_arr as $taxonomy_name => $terms_arr) {                    
                    $query_args['tax_query'][] = array(
                        'taxonomy' => $taxonomy_name,
                        'field' => 'term_id',
                        'terms' => $terms_arr
                    );
                }
            }

        }
    }
    $q = new WP_Query( $query_args );
    //Custom Post Type

    $block_name = 'wp-block-getwid-custom-post-type';

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

	$post_type =  isset($attributes['postType']) ? $attributes['postType'] : 'post';

    ob_start();
    ?>    
    <div class="<?php echo esc_attr( $class ); ?>">
        <div class="<?php echo esc_attr( $wrapper_class );?>">
            <?php

				//
				$template = $post_type;
				$located = getwid_locate_template( 'custom-post-type/' . $post_type );
				if ( !$located ) {
					$template = 'post';
				}

                if ( $q->have_posts() ){
                    ob_start();
                    
					while( $q->have_posts() ):
                        $q->the_post();
						getwid_get_template_part('custom-post-type/' . $template, $attributes, false, $extra_attr);
                    endwhile;
					
					wp_reset_postdata();
                    ob_end_flush();
                } else {
                    echo '<p>' . __('Nothing found.', 'getwid') . '</p>';
                }
            ?>
        </div>
    </div>
    <?php

    $result = ob_get_clean();
    return $result;
}

register_block_type(
    'getwid/custom-post-type',
    array(
        'attributes' => array(
            //Custom Post Type
            'postsToShow' => array(
                'type' => 'number',
                'default' => 5,
            ),            
            'postType' => array(
                'type' => 'string',
            ),
            'taxonomy' => array(
                'type' => 'array',
                'items'   => [
                    'type' => 'string',
                ],
            ),            
            'terms' => array(
                'type' => 'array',
                'items'   => [
                    'type' => 'string',
                ],
            ),
            'relation' => array(
                'type' => 'string',
                'default' => 'AND',
            ),
            'order' => array(
                'type' => 'string',
                'default' => 'desc',
            ),
            'orderBy' => array(
                'type' => 'string',
                'default' => 'date',
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
        ),
        'render_callback' => 'render_getwid_custom_post_type',
    )
);