<?php

function render_getwid_contact_form( $attributes ) {

    $block_name = 'wp-block-getwid-contact-form';

    $extra_attr = array(
        'block_name' => $block_name
    );

    $class = $block_name;

    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . $attributes['align'];
    }

    $wrapper_class = $block_name.'__wrapper';

    ob_start();
?>

    <div class="<?php echo esc_attr( $class ); ?>">
        <div class="<?php echo esc_attr( $wrapper_class );?>">
            
        </div>
    </div>

    <?php

    $result = ob_get_clean();
    return $result;
}

register_block_type(
    'getwid/contact-form',
    array(
        'attributes' => array(
            'email' => array(
                'type' => 'string',
                'default' => 'aleandr100@gmail.com',
            ),            
            'subject' => array(
                'type' => 'string',
                'default' => 'Fuck you bich!',
            ),			
            'align' => array(
                'type' => 'string',
            )            
        ),
        'render_callback' => 'render_getwid_contact_form',
    )
);

