<?php

function render_getwid_post_carousel( $attributes ) {

    //Custom Post Type
    $query_args = [];
    if ( isset($attributes['postType'])){

        $query_args = array(
            'post_type' => $attributes['postType'],
            'posts_per_page'   => $attributes['postsToShow'],
            'post__not_in' => array($attributes['currentID']),
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

    $block_name = 'wp-block-getwid-post-carousel';

    $extra_attr = array(
        'block_name' => $block_name
    );

    $class = $block_name;

    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . $attributes['align'];
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

    $wrapper_class .= " no-init-slider";

    if ( isset( $attributes['sliderSlidesToShowDesktop'] ) && $attributes['sliderSlidesToShowDesktop'] > 1 ) {
        $class .= ' has-slides-gap-'.$attributes['sliderSpacing'];
        $class .= ' is-carousel';
    }

    $class .= ' has-arrows-'.$attributes['sliderArrows'];
    $class .= ' has-dots-'.$attributes['sliderDots'];

    $sliderData = array(
        'sliderSlidesToShowDesktop' => $attributes['sliderSlidesToShowDesktop'],
        'getwid_slidesToShowLaptop' => $attributes['sliderSlidesToShowLaptop'],
        'getwid_slidesToShowTablet' => $attributes['sliderSlidesToShowTablet'],
        'getwid_slidesToShowMobile' => $attributes['sliderSlidesToShowMobile'],
        'getwid_slidesToScroll' => $attributes['sliderSlidesToScroll'],
        'getwid_autoplay' => $attributes['sliderAutoplay'],
        'getwid_autoplay_speed' => $attributes['sliderAutoplaySpeed'],
        'getwid_infinite' => $attributes['sliderInfinite'],
        'getwid_animation_speed' => $attributes['sliderAnimationSpeed'],
        'getwid_center_mode' => $attributes['sliderCenterMode'],
        'getwid_arrows' => $attributes['sliderArrows'],
        'getwid_dots' => $attributes['sliderDots'],
    );

    $slider_options = json_encode($sliderData);
    
    ob_start();
    ?>

    <div class="<?php echo esc_attr( $class ); ?>">
        <div data-slider-option="<?php echo esc_attr($slider_options); ?>" class="<?php echo esc_attr( $wrapper_class );?>">
            <?php
            if ( $q->have_posts() ):
                ob_start();
                while( $q->have_posts() ):
                    $q->the_post();
                    getwid_get_template_part('post-carousel/post', $attributes, false, $extra_attr);
                endwhile;
                wp_reset_postdata();
                ob_end_flush();
            endif;
            ?>
        </div>
    </div>
    <?php

    $result = ob_get_clean();
    return $result;
}

register_block_type(
    'getwid/post-carousel',
    array(
        'attributes' => array(
            'currentID' => array(
                'type' => 'number',
            ), 

            //Custom Post Type
            'postsToShow' => array(
                'type' => 'number',
                'default' => 5,
            ),            
            'postType' => array(
                'type' => 'string',
                'default' => 'post',
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
                'default' => true,
            ),
            'contentLength' => array(
                'type' => 'number',
                'default' => apply_filters('excerpt_length', 55),
            ),
            'showFeaturedImage' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'align' => array(
                'type' => 'string',
            ),

            //Slider
            'sliderSlidesToShowDesktop' => array(
                'type' => 'string',
                'default' => '3'
            ),
            'sliderSlidesToShowLaptop' => array(
                'type' => 'string',
                'default' => '1'
            ),
            'sliderSlidesToShowTablet' => array(
                'type' => 'string',
                'default' => '1'
            ),
            'sliderSlidesToShowMobile' => array(
                'type' => 'string',
                'default' => '1'
            ),
            'sliderSlidesToScroll' => array(
                'type' => 'string',
                'default' => '1'
            ),
            'sliderAutoplay' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'sliderAutoplaySpeed' => array(
                'type' => 'number',
                'default' => 6000
            ),
            'sliderInfinite' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'sliderAnimationSpeed' => array(
                'type' => 'number',
                'default' => 800
            ),
            'sliderCenterMode' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'sliderSpacing' => array(
                'type' => 'string',
                'default' => 'small'
            ),
            'sliderArrows' => array(
                'type' => 'string',
                'default' => 'inside'
            ),
            'sliderDots' => array(
                'type' => 'string',
                'default' => 'inside'
            ),            
        ),
        'render_callback' => 'render_getwid_post_carousel',
    )
);