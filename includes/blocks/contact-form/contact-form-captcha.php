<?php

function render_getwid_contact_form_captcha( $attributes ) {
    
    $block_name = 'wp-block-getwid-contact-form-captcha';

	$site_key = get_option('getwid_recaptcha_v2_site_key', '');
    $result = '';

    $extra_attr = array(
        'site_key' => $site_key
    );
	
	if ($site_key) {
		wp_enqueue_script( 'recaptcha', 'https://www.google.com/recaptcha/api.js');
        ob_start();?>

        <?php getwid_get_template_part('contact-form/captcha', $attributes, false, $extra_attr); ?><?php

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