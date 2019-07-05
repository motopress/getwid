<?php

function render_getwid_post_slider( $attributes ) {

    //Custom Post Type
    $query_args = [];
    getwid_build_custom_post_type_query($query_args, $attributes);

    $q = new WP_Query( $query_args );
    //Custom Post Type

    //Custom Template
    $use_template = false;
	$template_part_content = '';

    if ( isset( $attributes['postTemplate'] ) && $attributes['postTemplate'] != '' ) {

        $template_post = get_post($attributes['postTemplate'], ARRAY_A);

        //If post exist and content not empty
        if (!is_null($template_post) && $template_post['post_content'] != ''){
            $use_template = true;
            $template_part_content = $template_post['post_content'];
        }
    }

    $block_name = 'wp-block-getwid-post-slider';

    $post_type =  isset($attributes['postType']) ? $attributes['postType'] : 'post';

    $extra_attr = array(
        'block_name' => $block_name,
        'back_end' => \defined( 'REST_REQUEST' ) && REST_REQUEST && ! empty( $_REQUEST['context'] ) && 'edit' === $_REQUEST['context']
    );

    $class = $block_name;
    $class .= ' custom-post-type-' . esc_attr($post_type);

    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . esc_attr($attributes['align']);
    }
    if ( isset( $attributes['className'] ) ) {
        $class .= ' ' . esc_attr($attributes['className']);
    }

    $content_class = esc_attr($block_name).'__content';
    $content_class .= " no-init-slider";

    $slide_style = '';

    if ( isset( $attributes['minHeight'] ) ) {
        $slide_style .= 'style="min-height: '.esc_attr($attributes['minHeight']).';"';
    }

    $class .= ' has-arrows-'.esc_attr($attributes['sliderArrows']);
    $class .= ' has-dots-'.esc_attr($attributes['sliderDots']);

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

    <div
        <?php
        echo isset($attributes['anchor']) ? 'id="'.esc_attr($attributes['anchor']).'"' : '';
        ?>
        class="<?php echo esc_attr( $class ); ?>">

        <div data-slider-option="<?php echo esc_attr($slider_options); ?>" class="<?php echo esc_attr( $content_class );?>">
            <?php

			if ( !$use_template ) {
				$template = $post_type;
				$located = getwid_locate_template( 'post-slider/' . $post_type );
				if ( !$located ) {
					$template = 'post';
				}
			}

            if ( $q->have_posts() ):
                ob_start();

                while( $q->have_posts() ):
                    $q->the_post();
                    ?>
                    <div class="<?php echo $block_name;?>__slide" <?php echo $slide_style; ?>>
                    <?php
                    if ( $use_template ) {
                        echo do_blocks($template_part_content);
                    } else {
                        getwid_get_template_part('post-slider/' . $template, $attributes, false, $extra_attr);
                    }
                    ?>
                    </div>
                    <?php
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

            //Content
            'minHeight' => array(
                'type' => 'string',
            ),

            //Posts
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
            
            'className' => array(
                'type' => 'string',
            ),
            'anchor' => array(
                'type' => 'string',
            ),               
        ),
        'render_callback' => 'render_getwid_post_slider',
    )
);