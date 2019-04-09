<?php

function render_getwid_instagram( $attributes ) {
    $error = false;
    $empty = false;
    $options = get_option( 'getwid_settings');

    //If Empty Token
    if (isset($options['instagram_token']) && empty($options['instagram_token'])){
        return '<div class="components-notice is-warning"><div class="components-notice__content">'.__( 'Empty Access Token', 'getwid' ).'.</div></div>';
    }
    
    //Get Access Token
    $access_token = $options['instagram_token'];

    //Get Post Data from Instagram
    $curl_media = curl_init();
    curl_setopt($curl_media, CURLOPT_URL, 'https://api.instagram.com/v1/users/self/media/recent?access_token='.$access_token);
    curl_setopt($curl_media, CURLOPT_RETURNTRANSFER,true);
    $instagram_media = json_decode(curl_exec($curl_media));
    curl_close($curl_media);

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
    // var_dump($instagram_media);
    // var_dump($attributes);
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

                            <?php if (($attributes['showLikes'] && isset($value->likes->count)) || ($attributes['showComments'] && $value->comments->count != 0)) { ?>
                                <div class="<?php echo esc_attr($block_name); ?>__wrapper">
                                
                                    <?php if ($attributes['showLikes'] && isset($value->likes->count)) { ?>
                                        <span class="<?php echo esc_attr($block_name); ?>__likes"><i class="fas fa-heart"></i> <?php echo esc_attr($value->likes->count); ?></span>
                                    <?php } ?>

                                    <?php if ($attributes['showComments'] && $value->comments->count != 0) { ?>
                                        <span class="<?php echo esc_attr($block_name); ?>__comments"><i class="fas fa-comment"></i> <?php echo esc_attr($value->comments->count); ?></span>
                                    <?php } ?>

                                </div>
                            <?php } ?>                
                            <a href="<?php echo esc_url($value->link); ?>"><img src="<?php echo esc_url($value->images->standard_resolution->url); ?>"/></a>
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
        ),
        'render_callback' => 'render_getwid_instagram',
    )
);