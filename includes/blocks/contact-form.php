<?php    

/* #region render inner blocks */
function render_getwid_field_name( $attributes ) {
    ob_start();?>
    <?php getwid_get_template_part( 'contact-form/field-name', $attributes, false ); ?><?php

    $result = ob_get_clean();
    return $result;
}

function render_getwid_field_email( $attributes ) {
    ob_start();?>
    <?php getwid_get_template_part( 'contact-form/field-email', $attributes, false ); ?><?php

    $result = ob_get_clean();
    return $result;
}

function render_getwid_field_textarea( $attributes ) {
    ob_start();?>
    <?php getwid_get_template_part( 'contact-form/field-textarea', $attributes, false ); ?><?php

    $result = ob_get_clean();
    return $result;
}

function render_getwid_captcha( $attributes ) {    

	$site_key = get_option('getwid_recaptcha_v2_site_key', '');

    $extra_attr = array(
        'site_key' => $site_key
    );
	
	if ( $site_key ) {
        wp_enqueue_script( 'recaptcha', 'https://www.google.com/recaptcha/api.js?render=explicit&hl=en' );
        
        ob_start();?>
        <?php getwid_get_template_part( 'contact-form/captcha', $attributes, false, $extra_attr ); ?><?php

		$result = ob_get_clean();
	}

	return $result;
}
/* #endregion */

function render_getwid_contact_form( $attributes, $content ) {    

    wp_register_style(
        'contact-form-css',
        plugins_url( 'src/blocks/contact-form/style.css', GETWID_PLUGIN_DIR ),
        false,
        '1.0.3'
    );

    wp_enqueue_style( 'contact-form-css' );

    $class = 'wp-block-getwid-contact-form';

    $button_style = '';
    $button_class = '';

    getwid_custom_color_style_and_class( $button_style, $button_class, $attributes, 'color'      );
    getwid_custom_color_style_and_class( $button_style, $button_class, $attributes, 'background' );

    $extra_attr = array(
        'block_name' => $class,
        'content'    => $content,
        
        'button_style' => $button_style,
        'button_class' => $button_class
    );

    ob_start();?>
    <div class='<?php echo esc_attr( $class ); ?>'>
        <?php getwid_get_template_part( 'contact-form/contact-form', $attributes, false, $extra_attr ); ?>
    </div><?php
     
    $result = ob_get_clean();
    
    return $result;
}

/* #region register all blocks */
register_block_type(
    'getwid/contact-form',
    array( 'render_callback' => 'render_getwid_contact_form' )
);

register_block_type(
    'getwid/field-name',
    array( 'render_callback' => 'render_getwid_field_name' )
);

register_block_type(
    'getwid/field-email',
    array( 'render_callback' => 'render_getwid_field_email' )
);

register_block_type(
    'getwid/field-textarea',
    array( 'render_callback' => 'render_getwid_field_textarea' )
);

register_block_type(
    'getwid/captcha',
    array( 'render_callback' => 'render_getwid_captcha' )
);
/* #endregion */