<?php

function render_getwid_instagram( $attributes ) {
    $error = false;
    $empty = false;

    //Get Access Token
    $access_token = get_option( 'getwid_instagram_token');

    //If Empty Token
    if (isset($access_token) && empty($access_token)){
        if (current_user_can('manage_options')){
            return '<p>' . sprintf(
				__( 'Instagram Access Token is not set. <a href="%s">Connect Instagram Account</a>.', 'getwid' ),
				admin_url( 'options-writing.php' ) ) . '</p>';
        } else {
            return '';
        }
    }

	$instagram_media = get_transient( 'getwid_instagram_response_data' );
    if ( false === $instagram_media ) {

		//Get data from Instagram
        $response = wp_remote_get(
			'https://api.instagram.com/v1/users/self/media/recent?access_token=' . $access_token,
			array( 'timeout' => 15 )
		);

        if ( is_wp_error( $response ) ) {
			if ( current_user_can('manage_options') ){
                return '<p>' . $response->get_error_message() . '</p>';
            } else {
                return '';
            }
		} else {
            $instagram_media = json_decode( wp_remote_retrieve_body( $response ) );

            //JSON valid
            if ( json_last_error() === JSON_ERROR_NONE ) {
                if ( $instagram_media->meta->code == 200 ) {
					//Cache response
                    set_transient( 'getwid_instagram_response_data', $instagram_media, 30 * MINUTE_IN_SECONDS );
                } else {
                    if ( current_user_can('manage_options') ) {
                        return '<p>' . $instagram_media->meta->error_message . '</p>';
                    } else {
                        return '';
                    }
                }
            } else {
                return __( 'Error in json_decode.', 'getwid' );
            }
        }
    }

    $class = $block_name = 'wp-block-getwid-instagram';

    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . $attributes['align'];
    }

    $wrapper_class = 'wp-block-getwid-instagram__wrapper';
    $wrapper_class .= " has-" . $attributes['gridColumns'] . "-columns";

    if ( isset( $attributes['spacing'] ) && $attributes['spacing'] != 'default' ) {
        $class .= ' has-image-gap-' . $attributes['spacing'];
    }

    ob_start();
?><div class="<?php echo esc_attr( $class ); ?>">
	<div class="<?php echo esc_attr( $wrapper_class );?>">
		<?php
			$counter = 1;
			foreach ($instagram_media->data as $key => $value) {
				if ($counter <= $attributes['photoCount']) {
					?><div class="<?php echo $block_name . '__item'; ?>">
						<div class="<?php echo $block_name . '__media-wrapper'; ?>">
                            <a class="<?php echo $block_name . '__image-link'; ?>" target="_blank" href="<?php echo esc_url($value->link); ?>">
                                <?php
                                    if (isset($value->caption)){
                                        $alt = substr($value->caption->text, 0, 50);
                                    } else {
                                        $alt = '';
                                    }
                                ?>
								<img class="<?php echo $block_name . '__image'; ?>" src="<?php echo esc_url($value->images->standard_resolution->url); ?>" alt="<?php echo esc_attr($alt); ?>"/>
								<?php if (($attributes['showLikes'] && isset($value->likes->count)) || ($attributes['showComments'] && $value->comments->count != 0)) { ?>
								<div class="<?php echo $block_name . '__wrapper-container'; ?>">
									<div class="<?php echo $block_name . '__wrapper-content'; ?>">
										<?php if ($attributes['showLikes'] && isset($value->likes->count)) { ?>
										<span class="<?php echo $block_name . '__likes'; ?>"><i class="fas fa-heart"></i> <?php echo esc_attr($value->likes->count); ?></span>
										<?php } ?>
										<?php if ($attributes['showComments'] && $value->comments->count != 0) { ?>
										<span class="<?php echo $block_name . '__comments'; ?>"><i class="fas fa-comment"></i> <?php echo esc_attr($value->comments->count); ?></span>
										<?php } ?>
									</div>
								</div>
								<?php } ?>
							</a>
						</div>
					</div><?php
				}
				$counter ++;
			} // end foreach
		?></div>
</div><?php

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