<?php

function render_getwid_contact_form_email( $attributes ) {  

    $block_name = 'wp-block-getwid-contact-form-email';

    $extra_attr = array(
        'block_name' => $block_name
    );

    ob_start();
?>
    <?php getwid_get_template_part('contact-form/email', $attributes, false, $extra_attr); ?>
<?php

    $result = ob_get_clean();
    return $result;
}

register_block_type(
    'getwid/contact-form-email',
    array(
        'attributes' => array(
            'isRequired' => array(
                'type' => 'string',
                'default' => 'true'
            ),
            'label' => array(
                'type' => 'string'
            ),
            'email' => array(
                'type' => 'string'
            )
        ),
        'render_callback' => 'render_getwid_contact_form_email'
    )
);