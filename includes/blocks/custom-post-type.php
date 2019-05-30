<?php

function render_getwid_custom_post_type( $attributes ) {

    //Custom Post Type
    $query_args = [];
    if ( isset($attributes['postType'])){
		
		$paged = ( get_query_var( 'paged' ) ) ? absint( get_query_var( 'paged' ) ) : 1;

        $query_args = array(
            'post_type' => $attributes['postType'],
            'posts_per_page'   => $attributes['postsToShow'],
            'ignore_sticky_posts' => 1,
            'post_status'      => 'publish',
            'order'            => $attributes['order'],
            'orderby'          => $attributes['orderBy'],
        );

        if ( isset($attributes['pagination']) && $attributes['pagination'] ){
            $query_args['paged'] = $paged;
        }

        if ( isset($attributes['ignoreSticky']) ){
            $query_args['ignore_sticky_posts'] = $attributes['ignoreSticky'];
        }

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

    //Custom Template
    $use_template = false;
    if ( isset( $attributes['postTemplate'] ) && $attributes['postTemplate'] != '' ) {

        $template_post = get_post($attributes['postTemplate'], ARRAY_A);

        //If post exist and content not empty
        if (!is_null($template_post) && $template_post['post_content'] != ''){
            $use_template = true;
            $template_part_content = $template_post['post_content'];
        }
    }

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
    if ( isset( $attributes['className'] ) ) {
        $class .= ' ' . $attributes['className'];
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

				$template = $post_type;
				$located = getwid_locate_template( 'custom-post-type/' . $post_type );
				if ( !$located ) {
					$template = 'post';
				}

                if ( $q->have_posts() ){
                    ob_start();
                    
					while( $q->have_posts() ):
                        $q->the_post();
                            if ( $use_template ) {
                                echo '<div class="wp-block-getwid-post-template">';
                                    echo do_blocks($template_part_content);
                                echo '</div>';
                            } else {
                                getwid_get_template_part('custom-post-type/' . $template, $attributes, false, $extra_attr);
                            }
                    endwhile;

					wp_reset_postdata();
                    ob_end_flush();
                } else {
                    echo '<p>' . __('Nothing found.', 'getwid') . '</p>';
                }
            ?>
        </div>

        <?php if ( isset($attributes['pagination']) && $attributes['pagination'] ){ ?>
            <nav class="navigation pagination" role="navigation">
                <h2 class="screen-reader-text"><?php __('Posts navigation', 'getwid') ?></h2>
                <div class="nav-links">
                <?php 
                    echo paginate_links( array(
                        'base'         => str_replace( 999999999, '%#%', esc_url( get_pagenum_link( 999999999 ) ) ),
                        'total'        => $q->max_num_pages,
                        'current'      => max( 1, get_query_var( 'paged' ) ),
                        'format'       => '?paged=%#%',
                        'show_all'     => false,
                        'type'         => 'plain',
                        'end_size'     => 2,
                        'mid_size'     => 1,
                        'prev_next'    => true,
                        'prev_text'    => sprintf( '<i></i> %1$s', __( '<', 'getwid' ) ),
                        'next_text'    => sprintf( '%1$s <i></i>', __( '>', 'getwid' ) ),
                        'add_args'     => false,
                        'add_fragment' => '',
                    ) );
                ?>
                </div>
            </nav>
        <?php } ?>
    </div>
    <?php

    $result = ob_get_clean();
    return $result;
}

register_block_type(
    'getwid/custom-post-type',
    array(
        'attributes' => array(
            'postTemplate' => array(
                'type' => 'string',
            ),   

            //Custom Post Type
            'postsToShow' => array(
                'type' => 'number',
                'default' => 5,
            ),
            'pagination' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'ignoreSticky' => array(
                'type' => 'boolean',
                'default' => true,
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
            'className' => array(
                'type' => 'string',
            ),            
        ),        
        'render_callback' => 'render_getwid_custom_post_type',
    )
);