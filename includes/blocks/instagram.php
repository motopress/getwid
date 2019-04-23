<?php

function render_getwid_instagram( $attributes ) {
    $error = false;
    $empty = false;

    //Get Access Token
    $access_token = get_option( 'getwid_instagram_token');

    //If Empty Token
    if (isset($access_token) && empty($access_token)){
        if (current_user_can('manage_options')){
            return __( 'Empty Access Token', 'getwid' );
        } else {
            return '';
        }
    }

    //Chache request
    if ( false === ( $value = get_transient( 'value' ) ) ) {
        //Get Post Data from Instagram
        $response = wp_remote_get( 'https://api.instagram.com/v1/users/self/media/recent?access_token='.$access_token, array( 'timeout' => 15 ) );
        if ( is_array( $response ) && ! is_wp_error( $response ) ) {
            set_transient( 'getwid_instagram_response_data', $response['body'], 30 * MINUTE_IN_SECONDS );
            $instagram_media = json_decode($response['body']);
        } else {
            if (current_user_can('manage_options')){
                return __( 'Error Request URL', 'getwid' );
            } else {
                return '';
            }
        }
    } else {
        //Get cache data
        $instagram_media = json_decode(get_transient( 'getwid_instagram_response_data' ));
    }

    //If Wrong Token
    if ($instagram_media->meta->code == 400 ){
        if (current_user_can('manage_options')){
            return __( 'Wrong Access Token', 'getwid' );
        } else {
            return '';
        }
    }

    $block_name = 'wp-block-getwid-instagram';

    $extra_attr = array(
        'block_name' => $block_name
    );

    $class = $block_name;

    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . $attributes['align'];
    }

    $wrapper_class = 'wp-block-getwid-instagram__wrapper';

    $wrapper_class .= " getwid-columns getwid-columns-" . $attributes['gridColumns'];

    if ( isset( $attributes['spacing'] ) && $attributes['spacing'] !='default' ) {
        $class .= ' has-image-gap-'.$attributes['spacing'];
    }

    ob_start();
    ?>    

    <div class="<?php echo esc_attr( $class ); ?>">
        <div class="<?php echo esc_attr( $wrapper_class );?>">
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
            'spacing' => array(
                'type' => 'string',
                'default' => 'default',
            ),              
            'align' => array(
                'type' => 'string',
            ),
        ),
        'render_callback' => 'render_getwid_instagram',
    )
);