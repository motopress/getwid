<?php

function render_getwid_contact_form_captcha( $attributes ) {
    
    $block_name = 'wp-block-getwid-contact-form-captcha';

	$site_key = get_option('getwid_recaptcha_v2_site_key', '');
	$result = '';
	
	if ($site_key) {

		wp_enqueue_script(
			'recaptcha',
			'https://www.google.com/recaptcha/api.js'
		);
        ob_start();?>
            
        <div class='g-recaptcha' data-sitekey='<?php echo $site_key; ?>' data-theme='<?php echo $attributes['theme'] ?>'></div><?php

		$result = ob_get_clean();
	}

	return $result;
}

register_block_type(
    'getwid/contact-form-captcha',
    array(
        'attributes' => array(
            'size' => array(
                'type' => 'string'
            ),
            'theme' => array(
                'type' => 'string',
                'default' => 'light'
            ) 
        ),
        'render_callback' => 'render_getwid_contact_form_captcha'
    )
);