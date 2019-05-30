<?php

function render_getwid_contact_form( $attributes, $content ) {

    // echo '<pre>';
    // var_dump($content);
    // echo '</pre>';
    // exit();

    $block_name = 'wp-block-getwid-contact-form';

    $submit_button_style = '';
    $submit_button_class = '';

    $class = $block_name;

    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . $attributes['align'];
    }
    
    if ( isset( $attributes['backgroundColor'] ) || isset( $attributes['customBackgroundColor'] ) ) {
        preg_match('/^#/', $attributes['backgroundColor'], $matches);

        $background_color_hex = '';
        if ( isset( $matches[0] ) ) {
            $background_color_hex = $attributes['backgroundColor'];
        } else {
            list($get_colors) = get_theme_support('editor-color-palette');
            foreach ($get_colors as $key => $value) {
                if ($value['slug'] == $attributes['backgroundColor']) {
                    $background_color_hex =  $value['color'];
                }
            }        
        }

        if ( isset( $attributes['customBackgroundColor'] ) ) {
            $submit_button_style .= 'background-color:'.$attributes['customBackgroundColor'].';';
        } else {
            $submit_button_class .= ' has-background has-' . $attributes['backgroundColor'] . '-background-color';
        }
    }

    if ( isset( $attributes['textColor']) || isset( $attributes['customTextColor'] ) ) {
        preg_match('/^#/', $attributes['textColor'], $matches);

        $text_color_hex = '';
        if ( isset( $matches[0] ) ) {
            $text_color_hex = $attributes['textColor'];
        } else {
            list($get_colors) = get_theme_support('editor-color-palette');
            foreach ($get_colors as $key => $value) {
                if ($value['slug'] == $attributes['textColor']) {
                    $text_color_hex =  $value['color'];
                }
            }        
        }

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
                'type' => 'string',
                'default' => 'Submit'
            ),
            'captcha' => array(
                'type' => 'string',
                'default' => 'false'
            )
        ),
        'render_callback' => 'render_getwid_contact_form'
    )
);

