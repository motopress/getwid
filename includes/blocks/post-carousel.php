<?php

function render_getwid_post_carousel( $attributes ) {

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

    $block_name = 'wp-block-getwid-post-carousel';

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

    $wrapper_class = 'wp-block-getwid-post-carousel__wrapper';

    if ( isset( $attributes['columns'] ) && $attributes['postLayout'] === 'grid' ) {
        $wrapper_class .= " getwid-columns getwid-columns-" . $attributes['columns'];
    }

















    $wrapper_class .= " no-init-slider";

    if ( isset( $attributes['sliderSlidesToShow'] ) && $attributes['sliderSlidesToShow'] > 1 ) {
        $class .= ' has-slides-gap-'.$attributes['sliderSpacing'];
    }

    $class .= ' has-arrows-'.$attributes['sliderArrows'];
    $class .= ' has-dots-'.$attributes['sliderDots'];

    $sliderData = array(
        'getwid_fade_effect' => $attributes['sliderAnimationEffect'],
        'getwid_slidesToShow' => $attributes['sliderSlidesToShow'],
        'getwid_slidesToShowLaptop' => $attributes['sliderSlidesToShowLaptop'],
        'getwid_slidesToShowTablet' => $attributes['sliderSlidesToShowTablet'],
        'getwid_slidesToShowMobile' => $attributes['sliderSlidesToShowMobile'],
        'getwid_slidesToScroll' => $attributes['sliderSlidesToScroll'],
        'getwid_autoplay' => $attributes['sliderAutoplay'],
        'getwid_autoplay_speed' => $attributes['sliderAutoplaySpeed'],
        'getwid_infinite' => $attributes['sliderInfinite'],
        'getwid_animation_speed' => $attributes['sliderAnimationSpeed'],
        'getwid_center_mode' => $attributes['sliderCenterMode'],
        'getwid_variable_width' => $attributes['sliderVariableWidth'],
        'getwid_arrows' => $attributes['sliderArrows'],
        'getwid_dots' => $attributes['sliderDots'],
    );

    $slider_options = json_encode($sliderData);


















    $q = new WP_Query( $query_args );
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

            //Slider
            'sliderAnimationEffect' => array(
                'type' => 'string',
                'default' => 'slide'
            ),
            'sliderSlidesToShow' => array(
                'type' => 'string',
                'default' => '1'
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
            'sliderVariableWidth' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'sliderSpacing' => array(
                'type' => 'string',
                'default' => 'none'
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