<?php

function render_getwid_post_slider( $attributes ) {

    //Custom Post Type
    $query_args = [];
    getwid_build_custom_post_type_query($query_args, $attributes, ['exclude_current' => true]);

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

    $style = '';

    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . esc_attr($attributes['align']);
    }
    if ( isset( $attributes['className'] ) ) {
        $class .= ' ' . esc_attr($attributes['className']);
    }

    $content_class = esc_attr($block_name).'__content';
    $content_class .= " no-init-slider";

    $content_style = '';

    if ( isset( $attributes['minHeight'] ) ) {
        $content_style .= 'height: '.esc_attr($attributes['minHeight']).';';
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


    // ---------------------Process styles & classes---------------------
    //Slide style
    $slide_style = '';
    $slide_style = trim($slide_style);
    


    //Content Slide style
    $slide_container_style = '';
    //Padding
    $slide_container_class = esc_attr($extra_attr['block_name']).'__slide-container';
    getwid_custom_paddings_style_and_class($slide_container_style, $slide_container_class, $attributes);

    if ( isset( $attributes['minHeight'] ) ) {
        $slide_container_style .= 'min-height: '.esc_attr($attributes['minHeight']).';';
    }
    if ( isset( $attributes['verticalAlign'] ) ) {
        if ($attributes['verticalAlign'] == 'top'){
            $slide_container_style .= 'align-items: flex-start;';
        } elseif ($attributes['verticalAlign'] == 'center'){
            $slide_container_style .= 'align-items: center;';        
        } elseif ($attributes['verticalAlign'] == 'bottom'){
            $slide_container_style .= 'align-items: flex-end;';        
        }
    }
    if ( isset( $attributes['horizontalAlign'] ) ) {
        if ($attributes['horizontalAlign'] == 'left'){
            $slide_container_style .= 'justify-content: flex-start;';
        } elseif ($attributes['horizontalAlign'] == 'center'){
            $slide_container_style .= 'justify-content: center;';        
        } elseif ($attributes['horizontalAlign'] == 'right'){
            $slide_container_style .= 'justify-content: flex-end;';        
        }
    }
    $slide_container_style = trim($slide_container_style);
    $slide_container_class = trim($slide_container_class);
    
    //Wrapper Slide style
    $slide_wrapper_style = '';
    if ( isset( $attributes['contentMaxWidth'] ) ) {
        $slide_wrapper_style .= 'max-width: '.esc_attr($attributes['contentMaxWidth']).'px;';
    }
    $slide_wrapper_style = trim($slide_wrapper_style);
    

    //Media Slide style & class
    $slide_media_style = '';
    $slide_media_class = esc_attr($extra_attr['block_name']).'__slide-media-overlay';
    if ( isset( $attributes['overlayOpacity']) ) {
        $slide_media_style .= 'opacity: '.esc_attr($attributes['overlayOpacity']/100).';';
    }     
    getwid_custom_color_style_and_class($slide_media_style, $slide_media_class, $attributes, 'background', $extra_attr['back_end']);


    //Content Slide style & class
    $slide_content_style = '';
    $slide_content_class = esc_attr($extra_attr['block_name']).'__slide-post-content';
    if ( isset( $attributes['textAlignment']) ) {
        $slide_content_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }  
    getwid_custom_color_style_and_class($slide_content_style, $slide_content_class, $attributes, 'color', $extra_attr['back_end']);

    //Pack styles & class
    $extra_attr['styles'] = array(
        'slide_style' => $slide_style,
        'slide_container_style' => $slide_container_style,
        'slide_container_class' => $slide_container_class,
        'slide_wrapper_style' => $slide_wrapper_style,
        'slide_media_style' => $slide_media_style,
        'slide_media_class' => $slide_media_class,
        'slide_content_style' => $slide_content_style,
        'slide_content_class' => $slide_content_class,
    );
    // ---------------------/Process styles & classes---------------------

    ob_start();
    ?>

    <div <?php echo (isset( $attributes['anchor'] ) ? 'id="'.esc_attr($attributes['anchor']).'" ' : '' ); ?><?php echo (!empty($style) ? 'style="'.esc_attr($style).'" ' : '');?>class="<?php echo esc_attr( $class ); ?>">
        <div data-slider-option="<?php echo esc_attr($slider_options); ?>" <?php echo (!empty($content_style) ? 'style="'.esc_attr($content_style).'" ' : '');?>class="<?php echo esc_attr( $content_class );?>">
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
                    if ( $use_template ) {
                        echo '<div class="wp-block-getwid-post-slider__template">';
                            echo do_blocks($template_part_content);
                        echo '</div>';
                    } else {
                        getwid_get_template_part('post-slider/' . $template, $attributes, false, $extra_attr);
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
    'getwid/post-slider',
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