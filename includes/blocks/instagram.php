<?php

function render_getwid_instagram( $attributes ) {
    $error = false;
    $empty = false;

    //Get Access Token
    $access_token = get_option( 'getwid_instagram_token');

    //If Empty Token
    if (isset($access_token) && empty($access_token)){
        return '<div class="components-notice is-warning"><div class="components-notice__content">'.__( 'Empty Access Token', 'getwid' ).'.</div></div>';
    }

    //Get Post Data from Instagram
    $response = wp_remote_get( 'https://api.instagram.com/v1/users/self/media/recent?access_token='.$access_token );
    $instagram_media = json_decode($response['body']);

    //If Wrong Token
    if ($instagram_media->meta->code == 400 ){
        return '<div class="components-notice is-error"><div class="components-notice__content">'.__( 'Wrong Access Token', 'getwid' ).'</div></div>';
    }

    $block_name = 'wp-block-getwid-instagram';

    $extra_attr = array(
        'block_name' => $block_name
    );

    $class = $block_name;

    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . $attributes['align'];
    }

    if ( isset( $attributes['displayStyle'] ) ) {
        $class .= " layout-{$attributes['displayStyle']}";
    }

    $wrapper_class = 'wp-block-getwid-instagram__wrapper';

    if ( isset( $attributes['displayStyle'] ) && $attributes['displayStyle'] == 'grid' ) {
        $wrapper_class .= " getwid-columns getwid-columns-" . $attributes['gridColumns'];
    }

    //Slider settings
    if ( isset( $attributes['displayStyle'] ) && $attributes['displayStyle'] == 'carousel' ) {

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
    }

    ob_start();
    ?>    

    <div class="<?php echo esc_attr( $class ); ?>">
        <div <?php echo (isset( $attributes['displayStyle'] ) && $attributes['displayStyle'] == 'carousel' ? 'data-slider-option="'.esc_attr($slider_options).'"' : '');?> class="<?php echo esc_attr( $wrapper_class );?>">
            <?php
                $counter = 1;
                foreach ($instagram_media->data as $key => $value) {             
                    if ($counter <= $attributes['photoCount']){
                    ?>
                        <div class="<?php echo esc_attr($block_name); ?>__media-item">
                            <div class="<?php echo esc_attr($block_name); ?>__media-wrapper">                            
                                <a class="<?php echo esc_attr($block_name); ?>__image-link" target="_blank" href="<?php echo esc_url($value->link); ?>">
                                    
                                    <img src="<?php echo esc_url($value->images->standard_resolution->url); ?>"/>
                                    
                                    <?php if (($attributes['showLikes'] && isset($value->likes->count)) || ($attributes['showComments'] && $value->comments->count != 0)) { ?>
                                    <div class="<?php echo esc_attr($block_name); ?>__wrapper-container">
                                        <div class="<?php echo esc_attr($block_name); ?>__wrapper-content">
                                        
                                            <?php if ($attributes['showLikes'] && isset($value->likes->count)) { ?>
                                                <span class="<?php echo esc_attr($block_name); ?>__likes"><i class="fas fa-heart"></i> <?php echo esc_attr($value->likes->count); ?></span>
                                            <?php } ?>

                                            <?php if ($attributes['showComments'] && $value->comments->count != 0) { ?>
                                                <span class="<?php echo esc_attr($block_name); ?>__comments"><i class="fas fa-comment"></i> <?php echo esc_attr($value->comments->count); ?></span>
                                            <?php } ?>

                                        </div>
                                    </div>
                                    <?php } ?>  
                                                                                            
                                </a>
                            </div>
                        </div>
                    <?php
                    }
                $counter ++;
                }
            ?>
        </div>
    </div>
    <?php
    $result = ob_get_clean();
    return $result;
}

register_block_type(
    'getwid/instagram',
    array(
        'attributes' => array(
            'photoCount' => array(
                'type' => 'number',
                'default' => 10,
            ),  
            'displayStyle' => array(
                'type' => 'string',
                'default' => 'grid',
            ),  
            'gridColumns' => array(
                'type' => 'number',
                'default' => 3,
            ), 
			'showLikes' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'showComments' => array(
				'type' => 'boolean',
				'default' => true,
			),
            'align' => array(
                'type' => 'string',
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
        'render_callback' => 'render_getwid_instagram',
    )
);