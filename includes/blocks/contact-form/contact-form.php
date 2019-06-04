<?php

function render_getwid_contact_form( $attributes, $content ) {

    $block_name = 'wp-block-getwid-contact-form';

    $submit_button_style = '';
    $submit_button_class = '';

    $class = $block_name;

    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . $attributes['align'];
    }
    
    if ( isset( $attributes['backgroundColor'] ) || isset( $attributes['customBackgroundColor'] ) ) {
        if ( isset( $attributes['customBackgroundColor'] ) ) {
            $submit_button_style .= 'background-color:'.$attributes['customBackgroundColor'].';';
        } else {
            $submit_button_class .= ' has-background has-' . $attributes['backgroundColor'] . '-background-color';
        }
    }

    if ( isset( $attributes['textColor']) || isset( $attributes['customTextColor'] ) ) {
        if ( isset( $attributes['customTextColor'] ) ) {
            $submit_button_style .= 'color:'.$attributes['customTextColor'].';';
        } else {
            $submit_button_class .= ' has-text-color has-' . $attributes['textColor'] . '-color';
        }
    }

    $extra_attr = array(
        'block_name' => $block_name,
        'content'    => $content,
        'button_class' => $submit_button_class,
        'button_style' => $submit_button_style
    );

    ob_start();
?>

    <div class='<?php echo esc_attr( $class ); ?>'>
        <?php getwid_get_template_part('contact-form/form', $attributes, false, $extra_attr); ?>
    </div>

<?php

    $result = ob_get_clean();
    return $result;
}

register_block_type(
    'getwid/contact-form',
    array(
        'attributes' => array(
            'align' => array(
                'type' => 'string'
            ),
            'backgroundColor' => array(
                'type' => 'string'
            ),
            'textColor' => array(
                'type' => 'string'
            ),
            'customBackgroundColor' => array(
                'type' => 'string'
            ),
            'customTextColor' => array(
                'type' => 'string'
            ),
            'to' => array(
                'type' => 'string'
            ),
            'subject' => array(
                'type' => 'string'
            ),            
            'text' => array(
                'type' => 'string'
            ),
            'captcha' => array(
                'type' => 'string',
                'default' => 'false'
            )
        ),
        'render_callback' => 'render_getwid_contact_form'
    )
);

