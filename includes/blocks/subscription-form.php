<?php

$main_block = 'subscription-form';

/* #region render inner blocks */
function render_getwid_subscription_form_field_first_name( $attributes ) {
    $extra_attr = array( 'name' => 'first_name' );

    if ( ! isset( $attributes[ 'label' ] ) ) {
        $attributes[ 'label' ] = __( 'First name', 'getwid' );
    }

    ob_start();?>
    <?php getwid_get_template_part( 'form-elements/field-name', $attributes, false, $extra_attr ); ?><?php

    $result = ob_get_clean();
    return $result;
}

function render_getwid_subscription_form_field_last_name( $attributes ) {
    $extra_attr = array( 'name' => 'last_name' );
    
    if ( ! isset( $attributes[ 'label' ] ) ) {
        $attributes[ 'label' ] = __( 'Last name', 'getwid' );
    }

    ob_start();?>
    <?php getwid_get_template_part( 'form-elements/field-name', $attributes, false, $extra_attr ); ?><?php

    $result = ob_get_clean();
    return $result;
}

function render_getwid_subscription_form_field_email( $attributes ) {
    ob_start();?>
    <?php getwid_get_template_part( 'form-elements/field-email', $attributes, false ); ?><?php

    $result = ob_get_clean();
    return $result;
}
/* #endregion */

function render_getwid_subscription_form( $attributes, $content ) {

    $class      = 'wp-block-getwid-subscription-form';
    $block_name = 'subscription-form';

    if ( isset( $attributes[ 'className' ] ) ) {
        $class .= ' ' . esc_attr( $attributes[ 'className' ] );
    }

    if ( isset( $attributes[ 'align' ] ) ) {
        $class .= ' align' . esc_attr( $attributes[ 'align' ] );
    }

    $button_style = $button_class = '';

    getwid_custom_color_style_and_class( $button_style, $button_class, $attributes, 'color'      );
    getwid_custom_color_style_and_class( $button_style, $button_class, $attributes, 'background' );

    $extra_attr = array(
        'class' => $class,
        'block_name' => $block_name,
        'content'    => $content,
        
        'button_style' => $button_style,
        'button_class' => $button_class
    );    

    ob_start();

    if ( isset( $attributes[ 'ids' ] ) ) {?>
        <div class='<?php echo esc_attr( $class ); ?>'>
            <?php getwid_get_template_part( 'form-elements/form', $attributes, false, $extra_attr ); ?>
        </div><?php
    } else {?>
        <p><?php echo __( 'Select at least one MailChim list.', 'getwid' ); ?></p><?php
    }
     
    $result = ob_get_clean();
    
    return $result;
}

/* #region register all blocks */
register_block_type(
    'getwid/subscription-form',
    array(
        'render_callback' => 'render_getwid_subscription_form'
    )
);

register_block_type(
    "getwid/{$main_block}-field-email",
    array(
        'render_callback' => 'render_getwid_subscription_form_field_email'
    )
);

register_block_type(
    "getwid/{$main_block}-field-first-name",
    array(
        'render_callback' => 'render_getwid_subscription_form_field_first_name'
    )
);

register_block_type(
    "getwid/{$main_block}-field-last-name",
    array(
        'render_callback' => 'render_getwid_subscription_form_field_last_name'
    )
);
/* #endregion */