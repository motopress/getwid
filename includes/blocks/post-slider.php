<?php

function render_getwid_post_slider( $attributes ) {

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

    $block_name = 'wp-block-getwid-post-slider';

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

  /*   if ( isset( $attributes['sliderSlidesToShowDesktop'] ) && $attributes['sliderSlidesToShowDesktop'] > 1 ) {
        $class .= ' has-slides-gap-'.$attributes['sliderSpacing'];
        $class .= ' is-carousel';
    } */

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
                    getwid_get_template_part('post-slider/post', $attributes, false, $extra_attr);
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
    'getwid/post-slider',
    array(
        'attributes' => array(

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
            'textColor' => array(
                'type' => 'string',
            ),
            'overlayColor' => array(
                'type' => 'string',
            ),
            'overlayOpacity' => array(
                'type' => 'number',
                'default' => 30,
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
                'default' => true,
            ),
            'contentLength' => array(
                'type' => 'number',
                'default' => apply_filters('excerpt_length', 25),
            ),
            'showFeaturedImage' => array(
                'type' => 'boolean',
                'default' => true,
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