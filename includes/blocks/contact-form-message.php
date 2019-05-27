<?php

function render_getwid_contact_form_message( $attributes ) {  

    $block_name = 'wp-block-getwid-contact-form-name';

    $extra_attr = array(
        'block_name' => $block_name
    );

    ob_start();
?>
    <div class='<?php echo esc_attr( $block_name ); ?>'>
        <?php getwid_get_template_part('contact-form/message', $attributes, false, $extra_attr); ?>
    </div>

<?php

    $result = ob_get_clean();
    return $result;
}

register_block_type(
    'getwid/contact-form-message',
    array(
        'attributes' => array(
            'isRequired' => array(
                'type' => 'string',
                'default' => 'true'
            ),
            'label' => array(
                'type' => 'string'
            ),
            'message' => array(
                'type' => 'string'
            ) 
        ),
        'render_callback' => 'render_getwid_contact_form_message'
    )
);