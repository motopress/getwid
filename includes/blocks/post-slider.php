<?php

function render_getwid_post_slider( $attributes ) {

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


    // ---------------------Process styles & classes---------------------
    //Slide style
    $slide_style = '';
    if ( isset( $attributes['minHeight'] ) ) {
        $slide_style .= 'min-height: '.$attributes['minHeight'].';';
    }
    $slide_style = trim($slide_style);
    


    //Content Slide style
    $slide_container_style = '';
    //Padding
    $slide_container_class = $extra_attr['block_name'].'__slide-container';
    $slide_container_class .= (isset($attributes['paddingTop']) && $attributes['paddingTop'] !='' && $attributes['paddingTop'] != 'custom') ? " getwid-padding-top-".esc_attr($attributes['paddingTop']) : '';
    $slide_container_class .= (isset($attributes['paddingBottom']) && $attributes['paddingBottom'] !='' && $attributes['paddingBottom'] != 'custom') ? " getwid-padding-bottom-".esc_attr($attributes['paddingBottom']) : '';
    $slide_container_class .= (isset($attributes['paddingLeft']) && $attributes['paddingLeft'] !='' && $attributes['paddingLeft'] != 'custom') ? " getwid-padding-left-".esc_attr($attributes['paddingLeft']) : '';
    $slide_container_class .= (isset($attributes['paddingRight']) && $attributes['paddingRight'] !='' && $attributes['paddingRight'] != 'custom') ? " getwid-padding-right-".esc_attr($attributes['paddingRight']) : '';
    
    $slide_container_class .= (isset($attributes['paddingTopTablet']) && $attributes['paddingTopTablet'] !='' && $attributes['paddingTopTablet'] != 'custom') ? " getwid-padding-tablet-top-".esc_attr($attributes['paddingTopTablet']) : '';
    $slide_container_class .= (isset($attributes['paddingBottomTablet']) && $attributes['paddingBottomTablet'] !='' && $attributes['paddingBottomTablet'] != 'custom') ? " getwid-padding-tablet-bottom-".esc_attr($attributes['paddingBottomTablet']) : '';
    $slide_container_class .= (isset($attributes['paddingLeftTablet']) && $attributes['paddingLeftTablet'] !='' && $attributes['paddingLeftTablet'] != 'custom') ? " getwid-padding-tablet-left-".esc_attr($attributes['paddingLeftTablet']) : '';
    $slide_container_class .= (isset($attributes['paddingRightTablet']) && $attributes['paddingRightTablet'] !='' && $attributes['paddingRightTablet'] != 'custom') ? " getwid-padding-tablet-right-".esc_attr($attributes['paddingRightTablet']) : '';
    
    $slide_container_class .= (isset($attributes['paddingTopMobile']) && $attributes['paddingTopMobile'] !='' && $attributes['paddingTopMobile'] != 'custom') ? " getwid-padding-mobile-top-".esc_attr($attributes['paddingTopMobile']) : '';
    $slide_container_class .= (isset($attributes['paddingBottomMobile']) && $attributes['paddingBottomMobile'] !='' && $attributes['paddingBottomMobile'] != 'custom') ? " getwid-padding-mobile-bottom-".esc_attr($attributes['paddingBottomMobile']) : '';
    $slide_container_class .= (isset($attributes['paddingLeftMobile']) && $attributes['paddingLeftMobile'] !='' && $attributes['paddingLeftMobile'] != 'custom') ? " getwid-padding-mobile-left-".esc_attr($attributes['paddingLeftMobile']) : '';
    $slide_container_class .= (isset($attributes['paddingRightMobile']) && $attributes['paddingRightMobile'] !='' && $attributes['paddingRightMobile'] != 'custom') ? " getwid-padding-mobile-right-".esc_attr($attributes['paddingRightMobile']) : '';
    
    $slide_container_style .= (isset($attributes['paddingTop']) && $attributes['paddingTop'] !='' && $attributes['paddingTop'] == 'custom') ? "padding-top:".esc_attr($attributes['paddingTopValue']).";" : '';
    $slide_container_style .= (isset($attributes['paddingBottom']) && $attributes['paddingBottom'] !='' && $attributes['paddingBottom'] == 'custom') ? "padding-bottom:".esc_attr($attributes['paddingBottomValue']).";" : '';
    $slide_container_style .= (isset($attributes['paddingLeft']) && $attributes['paddingLeft'] !='' && $attributes['paddingLeft'] == 'custom') ? "padding-left:".esc_attr($attributes['paddingLeftValue']).";" : '';
    $slide_container_style .= (isset($attributes['paddingRight']) && $attributes['paddingRight'] !='' && $attributes['paddingRight'] == 'custom') ? "padding-right:".esc_attr($attributes['paddingRightValue']).";" : '';
    if ( isset( $attributes['minHeight'] ) ) {
        $slide_container_style .= 'min-height: '.$attributes['minHeight'].';';
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
        $slide_wrapper_style .= 'max-width: '.$attributes['contentMaxWidth'].'px;';
    }
    $slide_wrapper_style = trim($slide_wrapper_style);
    


    //Media Slide style & class
    $slide_media_style = '';
    $slide_media_class = $extra_attr['block_name'].'__slide-media-overlay';
    if (isset( $attributes['backgroundColor']) || isset( $attributes['customBackgroundColor'] )){
        preg_match('/^#/', $attributes['backgroundColor'], $matches);
        //HEX
        $backgroundColorHEX = '';
        if (isset($matches[0])){
            $backgroundColorHEX = $attributes['backgroundColor'];
        }
        //String
        else {
            $get_colors = get_theme_support('editor-color-palette')[0];
            foreach ($get_colors as $key => $value) {
                if ($value['slug'] == $attributes['backgroundColor']){
                    $backgroundColorHEX =  $value['color'];
                }
            }        
        }    
        if ($extra_attr['back_end']){
            $slide_media_style .= 'background-color: '.(isset( $attributes['customBackgroundColor'] ) ? $attributes['customBackgroundColor'] : $backgroundColorHEX).';';
        } else {
            if (isset($attributes['customBackgroundColor'])){
                $slide_media_style .= 'background-color: '.$attributes['customBackgroundColor'].';';
            } else {
                $slide_media_class .= ' has-background has-' . $attributes['backgroundColor'] . '-background-color';
            }
        } 
    }
    if ( isset( $attributes['overlayOpacity']) ) {
        $slide_media_style .= 'opacity: '.($attributes['overlayOpacity']/100).';';
    }  
    $slide_media_style = trim($slide_media_style);
    $slide_media_class = trim($slide_media_class);



    //Content Slide style & class
    $slide_content_style = '';
    $slide_content_class = $extra_attr['block_name'].'__slide-content';
    if ( isset( $attributes['textAlignment']) ) {
        $slide_content_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }  
    if (isset( $attributes['textColor']) || isset( $attributes['customTextColor'] )){
        preg_match('/^#/', $attributes['textColor'], $matches);
        //HEX
        $textColorHEX = '';
        if (isset($matches[0])){
            $textColorHEX = $attributes['textColor'];
        }
        //String
        else {
            $get_colors = get_theme_support('editor-color-palette')[0];
            foreach ($get_colors as $key => $value) {
                if ($value['slug'] == $attributes['textColor']){
                    $textColorHEX =  $value['color'];
                }
            }        
        }
        if ($extra_attr['back_end']){
            $slide_content_style .= 'color: '.(isset( $attributes['customTextColor'] ) ? $attributes['customTextColor'] : $textColorHEX).';';
        } else {
            if (isset($attributes['customTextColor'])){
                $slide_content_style .= 'color: '.$attributes['customTextColor'].';';
            } else {
                $slide_content_class .= ' has-text-color has-' . $attributes['textColor'] . '-color';
            }
        }
    }
    $slide_content_style = trim($slide_content_style);
    $slide_content_class = trim($slide_content_class);

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

    $post_type =  isset($attributes['postType']) ? $attributes['postType'] : 'post';

    ob_start();
    ?>

    <div class="<?php echo esc_attr( $class ); ?>">
        <div class="<?php echo esc_attr($block_name); ?>__slides-wrapper">
            <div data-slider-option="<?php echo esc_attr($slider_options); ?>" class="<?php echo esc_attr( $content_class );?>">
                <?php

                $template = $post_type;
                $located = getwid_locate_template( 'post-slider/' . $post_type );
                if ( !$located ) {
                    $template = 'post';
                }

                if ( $q->have_posts() ):
                    ob_start();

					while( $q->have_posts() ):
                        $q->the_post();
                        if ( $use_template ) {
                            echo '<div class="wp-block-getwid-post-template">';
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