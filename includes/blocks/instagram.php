<?php

function render_getwid_instagram( $attributes ) {
    $access_token = get_option('getwid_instagram_token', '');

    //demo9681
    if ($attributes['getDataFrom'] == 'username' && !empty($attributes['userName'])){
        //Get User Data from Instagram
        $curl_user = curl_init();
        curl_setopt($curl_user, CURLOPT_URL, 'https://www.instagram.com/web/search/topsearch/?context=user&count=0&query='.$attributes['userName']);
        curl_setopt($curl_user, CURLOPT_RETURNTRANSFER,true);
        $temp_data = json_decode(curl_exec($curl_user));
        curl_close($curl_user);

        if ($temp_data){
            $instagram_user = array(
                'id' => $temp_data->users[0]->user->pk,
                'full_name' => $temp_data->users[0]->user->full_name,
                'is_private' => $temp_data->users[0]->user->is_private,
                'user_photo' => $temp_data->users[0]->user->profile_pic_url
            );
        }


 


        // var_dump($instagram_user->users[0]->user);

        // pk
        // full_name
        // is_private

        // exit('123');



    }
    

    //Get Post Data from Instagram
    $curl_media = curl_init();
    curl_setopt($curl_media, CURLOPT_URL, 'https://api.instagram.com/v1/users/'.($attributes['getDataFrom'] == 'self' ? 'self' : ($attributes['getDataFrom'] == 'username' && !empty($attributes['userName']) ? $instagram_user['id'] : 'self')).'/media/recent?access_token='.$access_token);
    curl_setopt($curl_media, CURLOPT_RETURNTRANSFER,true);
    $instagram_media = json_decode(curl_exec($curl_media));
    curl_close($curl_media);    

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
    if ( isset( $attributes['className'] ) ) {
        $class .= ' ' . $attributes['className'];
    }

    $wrapper_class = 'wp-block-getwid-instagram__wrapper';

    if ( isset( $attributes['displayStyle'] ) && $attributes['displayStyle'] == 'grid' ) {
        $wrapper_class .= " getwid-columns getwid-columns-" . $attributes['gridColumns'];
    }
    // var_dump($instagram_media);

    // $attributes['photoCount']

    // var_dump($attributes);
    // exit();
    ob_start();
    ?>    

    <div class="<?php echo esc_attr( $class ); ?>">
        <div class="<?php echo esc_attr( $wrapper_class );?>">
            <?php

            

                $counter = 1;
                foreach ($instagram_media->data as $key => $value) {             
                    if ($counter <= $attributes['photoCount']){
                    ?>
                        <div className="<?php echo esc_attr($attributes['className']); ?>__media-item">
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
            'getDataFrom' => array(
                'type' => 'string',
                'default' => 'self',
            ),  
            'userName' => array(
                'type' => 'string',
            ),  
            'tagName' => array(
                'type' => 'string',
            ),  
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
            'linkTo' => array(
                'type' => 'string',
                'default' => 'image',
            ), 
			'showLikes' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'showComments' => array(
				'type' => 'boolean',
				'default' => true,
			),
            'blockAlignment' => array(
                'type' => 'string',
            ),
        ),
        'render_callback' => 'render_getwid_instagram',
    )
);