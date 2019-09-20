<?php

use Getwid\MailChimp\MailChimp;

$main_block = 'mailchimp';

add_action( 'wp_ajax_getwid_change_mailchimp_api_key', 'getwid_change_mailchimp_api_key' );

add_action( 'wp_ajax_getwid_subscribe'       , 'getwid_subscribe' );
add_action( 'wp_ajax_nopriv_getwid_subscribe', 'getwid_subscribe' );

/* #region render inner blocks */
function render_getwid_mailchimp_field_first_name( $attributes ) {
    $extra_attr = array( 'name' => 'first_name' );

    if ( ! isset( $attributes[ 'label' ] ) ) {
        $attributes[ 'label' ] = __( 'First name', 'getwid' );
    }

    ob_start();?>
    <?php getwid_get_template_part( 'mailchimp/field-first-name', $attributes, false, $extra_attr ); ?><?php

    $chash = ob_get_clean();
    return $chash;
}

function render_getwid_mailchimp_field_last_name( $attributes ) {
    $extra_attr = array( 'name' => 'last_name' );
    
    if ( ! isset( $attributes[ 'label' ] ) ) {
        $attributes[ 'label' ] = __( 'Last name', 'getwid' );
    }

    ob_start();?>
    <?php getwid_get_template_part( 'mailchimp/field-last-name', $attributes, false, $extra_attr ); ?><?php

    $chash = ob_get_clean();
    return $chash;
}

function render_getwid_mailchimp_field_email( $attributes ) {
    ob_start();?>
    <?php getwid_get_template_part( 'mailchimp/field-email', $attributes, false ); ?><?php

    $chash = ob_get_clean();
    return $chash;
}
/* #endregion */

function render_getwid_mailchimp( $attributes, $content ) {

    $class      = 'wp-block-getwid-mailchimp';
    $block_name = $class;

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
            <?php getwid_get_template_part( 'mailchimp/mailchimp', $attributes, false, $extra_attr ); ?>
        </div><?php
    } else {?>
        <p><?php echo __( 'Select at least one MailChim list.', 'getwid' ); ?></p><?php
    }
     
    $chash = ob_get_clean();
    
    return $chash;
}

function getwid_change_mailchimp_api_key() {
    $nonce = $_POST[ 'nonce' ];

    if ( ! wp_verify_nonce( $nonce, 'getwid_nonce_mailchimp_api_key' ) ) {
        wp_send_json_error();
    }

    $data   = $_POST[ 'data'   ];
    $option = $_POST[ 'option' ];

    $api_key = $data[ 'api_key' ];

    if ( $option == 'save' || $option == 'sync' ) {
        if ( ! empty( $api_key ) ) {
            update_option( 'getwid_mailchimp_api_key', $api_key );

            try {
                $mailchimp = new MailChimp( $api_key );
            } catch ( \Exception $exception ) {
                wp_send_json_error( $exception->getMessage() );
            }

            $sync = false;
            if ( $option == 'sync' ) {
                $sync = true;                

                $mailchimp->get_lists();
            }

            $chash = $mailchimp->get_account_subscribe_lists( $sync );
            wp_send_json_success( $chash );
        }
    } elseif ( $option == 'delete' ) {
        delete_option( 'getwid_mailchimp_api_key' );
        delete_option( 'audiences_list_chash'     );
    }
}

function getwid_subscribe() {
    $api_key = get_option( 'getwid_mailchimp_api_key' );
    $mailchimp = new MailChimp( $api_key );

    $mailchimp->subscribe();
}

/* #region register all blocks */
register_block_type(
    'getwid/mailchimp',
    array(
        'render_callback' => 'render_getwid_mailchimp'
    )
);

register_block_type(
    "getwid/{$main_block}-field-email",
    array(
        'render_callback' => 'render_getwid_mailchimp_field_email'
    )
);

register_block_type(
    "getwid/{$main_block}-field-first-name",
    array(
        'render_callback' => 'render_getwid_mailchimp_field_first_name'
    )
);

register_block_type(
    "getwid/{$main_block}-field-last-name",
    array(
        'render_callback' => 'render_getwid_mailchimp_field_last_name'
    )
);
/* #endregion */