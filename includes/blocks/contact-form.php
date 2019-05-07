<?php

function render_getwid_contact_form( $attributes ) {    

    $block_name = 'wp-block-getwid-contact-form';

    $class = $block_name;

    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . $attributes['align'];
    }

    $wrapper_class = $block_name.'__wrapper';

    $submit_button_style = '';
    $submit_button_class = 'components-button is-button is-primary';
    
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

        if ( $isEditor ) {
            $submit_button_style .= 'background-color: '.(isset( $attributes['customBackgroundColor'] ) ? $attributes['customBackgroundColor'] : $background_color_hex).';';
        } else {
            if ( isset( $attributes['customBackgroundColor'] ) ) {
                $submit_button_style .= 'background-color:'.$attributes['customBackgroundColor'].';';
            } else {
                $submit_button_class .= ' has-background has-' . $attributes['backgroundColor'] . '-background-color';
            }
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

        if ( $isEditor ) {
            $submit_button_style .= 'color: '.(isset( $attributes['customTextColor'] ) ? $attributes['customTextColor'] : $text_color_hex).';';
        } else {
            if ( isset( $attributes['customTextColor'] ) ) {
                $submit_button_style .= 'color:'.$attributes['customTextColor'].';';
            } else {
                $submit_button_class .= ' has-text-color has-' . $attributes['textColor'] . '-color';
            }
        }
    }

    $extra_attr = array(
        'block_name' => $block_name,
        'class' => $submit_button_class,
        'style' => $submit_button_style
    );

    ob_start();
?>

    <div class='<?php echo esc_attr( $class );?>'>
        <div class='<?php echo esc_attr( $wrapper_class );?>'>
            <?php getwid_get_template_part('contact-form/message', $attributes, false, $extra_attr); ?>
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
            'isEditor' => array(
                'type' => 'boolean',
                'default' => true
            ),
            'to' => array(
                'type' => 'string',
                'default' => '',
            ),
            'subject' => array(
                'type' => 'string',
                'default' => '',
            ),			
            'align' => array(
                'type' => 'string',
            ),
            'backgroundColor' => array(
                'type' => 'string',
            ),
            'textColor' => array(
                'type' => 'string',
            ),
            'customBackgroundColor' => array(
                'type' => 'string',
            ),
            'customTextColor' => array(
                'type' => 'string',
            )
        ),
        'render_callback' => 'render_getwid_contact_form',
    )
);

