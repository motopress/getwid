<?php    

/* #region render inner blocks */
function render_getwid_field_first_name( $attributes ) {
    $attributes[ 'name' ] = 'first_name';

    if ( ! isset( $attributes[ 'label' ] ) ) {
        $attributes[ 'label' ] = __( 'First name', 'getwid' );
    }

    ob_start();?>
    <?php getwid_get_template_part( 'contact-form/field-name', $attributes, false ); ?><?php

    $result = ob_get_clean();
    return $result;
}

function render_getwid_field_last_name( $attributes ) {
    $attributes[ 'name' ] = 'last_name';
    
    if ( ! isset( $attributes[ 'label' ] ) ) {
        $attributes[ 'label' ] = __( 'Last name', 'getwid' );
    }

    ob_start();?>
    <?php getwid_get_template_part( 'contact-form/field-name', $attributes, false ); ?><?php

    $result = ob_get_clean();
    return $result;
}

function render_getwid_subscribe_field_email( $attributes ) {
    ob_start();?>
    <?php getwid_get_template_part( 'contact-form/field-email', $attributes, false ); ?><?php

    $result = ob_get_clean();
    return $result;
}
/* #endregion */

function render_getwid_subscription_form( $attributes, $content ) {

    $class = 'wp-block-getwid-subscribe-form';
    $block_name = $class;

    if ( isset( $attributes[ 'className' ] ) ) {
        $class .= ' ' . esc_attr( $attributes[ 'className' ] );
    }

    if ( isset( $attributes[ 'align' ] ) ) {
        $class .= ' align' . esc_attr( $attributes[ 'align' ] );
    }

    $button_style = '';
    $button_class = '';

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
            <?php getwid_get_template_part( 'subscribe-form/subscribe-form', $attributes, false, $extra_attr ); ?>
        </div><?php
    } else {?>
        <p><?php echo __( 'Select at least one MailChim list.', 'getwid' ) ?></p><?php
    }
     
    $result = ob_get_clean();
    
    return $result;
}

/* #region register all blocks */
register_block_type(
    'getwid/subscribe-form',
    array(
        'render_callback' => 'render_getwid_subscription_form'
    )
);

register_block_type(
    'getwid/field-subscriptions',
    array(
        'render_callback' => 'render_getwid_subscribe_field_email'
    )
);

register_block_type(
    'getwid/field-first-name',
    array(
        'render_callback' => 'render_getwid_field_first_name'
    )
);

register_block_type(
    'getwid/field-last-name',
    array(
        'render_callback' => 'render_getwid_field_last_name'
    )
);
/* #endregion */