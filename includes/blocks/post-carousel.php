<?php

function render_getwid_post_carousel( $attributes ) {

    //Custom Post Type
    $query_args = [];
    getwid_build_custom_post_type_query($query_args, $attributes, ['exclude_current' => true]);

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

    $block_name = 'wp-block-getwid-post-carousel';

    $post_type =  isset($attributes['postType']) ? $attributes['postType'] : 'post';

    $extra_attr = array(
        'block_name' => $block_name,
    );

    $class = $block_name;
    $class .= ' custom-post-type-' . esc_attr($post_type);

    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . $attributes['align'];
    }

    if ( isset( $attributes['showPostDate'] ) && $attributes['showPostDate'] ) {
        $class .= ' has-dates';
    }
    if ( isset( $attributes['className'] ) ) {
        $class .= ' ' . esc_attr($attributes['className']);
    }
	if( isset( $attributes['cropImages'] ) && $attributes['cropImages'] === true ){
		$class .= ' has-cropped-images';
    }

    $wrapper_class = esc_attr($block_name).'__wrapper';

    $wrapper_class .= " no-init-slider";

    if ( isset( $attributes['sliderSlidesToShowDesktop'] ) && $attributes['sliderSlidesToShowDesktop'] > 1 ) {
        $class .= ' has-slides-gap-'.esc_attr($attributes['sliderSpacing']);
        $class .= ' is-carousel';
    }

    $class .= ' has-arrows-'.esc_attr($attributes['sliderArrows']);
    $class .= ' has-dots-'.esc_attr($attributes['sliderDots']);

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

    <div <?php echo (isset( $attributes['anchor'] ) ? 'id="'.esc_attr($attributes['anchor']).'" ' : '' ); ?>class="<?php echo esc_attr( $class ); ?>">
        <div data-slider-option="<?php echo esc_attr($slider_options); ?>" class="<?php echo esc_attr( $wrapper_class );?>">
            <?php

            $template = $post_type;
            $located = getwid_locate_template( 'post-carousel/' . $post_type );
            if ( !$located ) {
                $template = 'post';
            }

            if ( $q->have_posts() ):
                ob_start();
                
				while( $q->have_posts() ):
                    $q->the_post();
                    if ( $use_template ) {
                        echo '<div class="wp-block-getwid-post-carousel__template">';
                            echo do_blocks($template_part_content);
                        echo '</div>';
                    } else {
                        getwid_get_template_part('post-carousel/' . $template, $attributes, false, $extra_attr);
                    }                    
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
            'postTemplate' => array(
                'type' => 'string',
            ),              

            //Custom Post Type
            'postsToShow' => array(
                'type' => 'number',
                'default' => 5,
            ),     
            'ignoreSticky' => array(
                'type' => 'boolean',
                'default' => true,
            ),      
            'filterById' => array(
                'type' => 'string',
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
                'type' => 'string',
                'default' => 'excerpt',
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
                'default' => '2'
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
                'default' => 'ouside'
            ),     
            
            'className' => array(
                'type' => 'string',
            ),
            'anchor' => array(
                'type' => 'string',
            ),               
        ),
        'render_callback' => 'render_getwid_post_carousel',
    )
);