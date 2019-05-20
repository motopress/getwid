<?php

function render_getwid_post_slider( $attributes ) {

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

    $block_name = 'wp-block-getwid-post-slider';

    $extra_attr = array(
        'block_name' => $block_name,
        'back_end' => \defined( 'REST_REQUEST' ) && REST_REQUEST && ! empty( $_REQUEST['context'] ) && 'edit' === $_REQUEST['context']
    );

    $class = $block_name;

    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['className'] ) ) {
        $class .= ' ' . $attributes['className'];
    }

    $content_class = $block_name.'__content';

    $content_class .= " no-init-slider";

    $class .= ' has-arrows-'.$attributes['sliderArrows'];
    $class .= ' has-dots-'.$attributes['sliderDots'];

    $sliderData = array(
        'getwid_fade_effect' => $attributes['sliderAnimationEffect'],
        'getwid_autoplay' => $attributes['sliderAutoplay'],
        'getwid_autoplay_speed' => $attributes['sliderAutoplaySpeed'],
        'getwid_infinite' => $attributes['sliderInfinite'],
        'getwid_animation_speed' => $attributes['sliderAnimationSpeed'],
        'getwid_arrows' => $attributes['sliderArrows'],
        'getwid_dots' => $attributes['sliderDots'],
    );

    $slider_options = json_encode($sliderData);
    ob_start();
    ?>

    <div class="<?php echo esc_attr( $class ); ?>">
        <div class="<?php echo esc_attr($block_name); ?>__slides-wrapper">
            <div data-slider-option="<?php echo esc_attr($slider_options); ?>" class="<?php echo esc_attr( $content_class );?>">
                <?php
                if ( $q->have_posts() ):
                    ob_start();
                    while( $q->have_posts() ):
                        $q->the_post();
                        getwid_get_template_part('post-slider/post', $attributes, false, $extra_attr);
                    endwhile;
                    wp_reset_postdata();
                    ob_end_flush();
                endif;
                ?>            
            </div>
        </div>
    </div>
    <?php

    $result = ob_get_clean();
    return $result;
}

register_block_type(
    'getwid/post-slider',
    array(
        'attributes' => array(
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

            //Content
            'minHeight' => array(
                'type' => 'string',
            ),
            'contentMaxWidth' => array(
                'type' => 'number',
            ),
            'verticalAlign' => array(
                'type' => 'string',
            ),
            'horizontalAlign' => array(
                'type' => 'string',
            ),

            //Colors
            'textColor' => array(
                'type' => 'string',
            ),
            'customTextColor' => array(
                'type' => 'string',
            ),
            'backgroundColor' => array(
                'type' => 'string',
            ),        
            'customBackgroundColor' => array(
                'type' => 'string',
            ),
            //Colors

            'overlayOpacity' => array(
                'type' => 'number',
                'default' => 30,
            ),


            // Padding
            'paddingTopValue' => array(
                'type' => 'string'
            ),
            'paddingBottomValue' => array(
                'type' => 'string'
            ),
            'paddingLeftValue' => array(
                'type' => 'string'
            ),
            'paddingRightValue' => array(
                'type' => 'string'
            ),

            'paddingTop' => array(
                'type' => 'string',
                'default' => ''
            ),
            'paddingBottom' => array(
                'type' => 'string',
                'default' => ''
            ),
            'paddingLeft' => array(
                'type' => 'string',
                'default' => ''
            ),
            'paddingRight' => array(
                'type' => 'string',
                'default' => ''
            ),

            'paddingTopTablet' => array(
                'type' => 'string',
                'default' => ''
            ),
            'paddingBottomTablet' => array(
                'type' => 'string',
                'default' => ''
            ),
            'paddingLeftTablet' => array(
                'type' => 'string',
                'default' => ''
            ),
            'paddingRightTablet' => array(
                'type' => 'string',
                'default' => ''
            ),


            'paddingTopMobile' => array(
                'type' => 'string',
                'default' => ''
            ),
            'paddingBottomMobile' => array(
                'type' => 'string',
                'default' => ''
            ),
            'paddingLeftMobile' => array(
                'type' => 'string',
                'default' => ''
            ),
            'paddingRightMobile' => array(
                'type' => 'string',
                'default' => ''
            ),


            //Posts
            'titleTag' => array(
                'type' => 'string',
                'default' => 'h3',
            ),
            'imageSize' => array(
                'type' => 'string',
                'default' => 'large',
            ),
            'className' => array(
                'type' => 'string',
            ),
            'showTitle' => array(
                'type' => 'boolean',
                'default' => true,
            ), 
            'showContent' => array(
                'type' => 'string',
                'default' => 'excerpt',
            ),            
            'contentLength' => array(
                'type' => 'number',
                'default' => apply_filters('excerpt_length', 55),
            ),
            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
                'default' => 'left',
            ),

            //Slider
            'sliderAnimationEffect' => array(
                'type' => 'string',
                'default' => 'slide'
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
            'sliderArrows' => array(
                'type' => 'string',
                'default' => 'inside'
            ),
            'sliderDots' => array(
                'type' => 'string',
                'default' => 'inside'
            ),            
        ),
        'render_callback' => 'render_getwid_post_slider',
    )
);