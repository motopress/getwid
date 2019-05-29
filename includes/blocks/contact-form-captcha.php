<?php

function render_getwid_contact_form_captcha( $attributes ) {
    
    $block_name = 'wp-block-getwid-contact-form-captcha';

    $extra_attr = array(
        'block_name' => $block_name
    );

    ob_start();
?>
    <div class='<?php echo esc_attr( $block_name ); ?>' data-theme='<?php echo esc_attr($attributes['theme']); ?>'>
        <?php getwid_get_template_part('contact-form/captcha', $attributes, false, $extra_attr); ?>
    </div>
    
<?php

    $result = ob_get_clean();
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