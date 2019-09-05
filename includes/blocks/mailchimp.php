<?php

//use DrewM\MailChimp\MailChimp;

use Getwid\M\M;

$main_block = 'mailchimp';
//$mail_chimp = null;

add_action( 'wp_ajax_change_mailchimp_api_key', 'change_mailchimp_api_key'    );
// add_action( 'wp_ajax_get_account_subscribe_lists'    , 'get_account_subscribe_lists' );

// add_action( 'wp_ajax_subscribe'       , 'subscribe' );
// add_action( 'wp_ajax_nopriv_subscribe', 'subscribe' );

/* #region render inner blocks */
function render_getwid_subscription_form_field_first_name( $attributes ) {
    $extra_attr = array( 'name' => 'first_name' );

    if ( ! isset( $attributes[ 'label' ] ) ) {
        $attributes[ 'label' ] = __( 'First name', 'getwid' );
    }

    ob_start();?>
    <?php getwid_get_template_part( 'form-elements/field-name', $attributes, false, $extra_attr ); ?><?php

    $chash = ob_get_clean();
    return $chash;
}

function render_getwid_subscription_form_field_last_name( $attributes ) {
    $extra_attr = array( 'name' => 'last_name' );
    
    if ( ! isset( $attributes[ 'label' ] ) ) {
        $attributes[ 'label' ] = __( 'Last name', 'getwid' );
    }

    ob_start();?>
    <?php getwid_get_template_part( 'form-elements/field-name', $attributes, false, $extra_attr ); ?><?php

    $chash = ob_get_clean();
    return $chash;
}

function render_getwid_subscription_form_field_email( $attributes ) {
    ob_start();?>
    <?php getwid_get_template_part( 'form-elements/field-email', $attributes, false ); ?><?php

    $chash = ob_get_clean();
    return $chash;
}
/* #endregion */

function render_getwid_subscription_form( $attributes, $content ) {

    $class      = 'wp-block-getwid-mailchimp';
    $block_name = 'mailchimp';

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
     
    $chash = ob_get_clean();
    
    return $chash;
}

function change_mailchimp_api_key() {
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

            //global $mail_chimp;
            $mailchimp = new M( $api_key );

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

// function get_lists() {

//     global $mail_chimp;
//     $response = $mail_chimp->get( 'lists' );

//     if ( $mail_chimp->success() ) {
//         if ( isset( $response[ 'lists' ] ) ) {
//             $response = array_map( function ( $item ) {
//                 return array( 'id' => $item[ 'id' ], 'title' => $item[ 'name' ] );
//             }, $response[ 'lists' ] );
//         }        
//     } else {
//         $error = $mail_chimp->getLastError();
//         wp_send_json_error( $error );
//     }

//     return $response;
// }

// function get_account_subscribe_lists( $sync = false ) {

//     if ( ! $sync ) {
//         $chash = get_option( 'audiences_list_chash' );
//     }    

//     if ( $sync || empty( $chash ) ) {
//         $chash = array();

//         $list = get_lists();

//         if ( count( $list ) > 0 ) {
//             $chash = $list;
        
//             foreach ( $list as $key => $list_item ) {
//                 $categories = get_interest_categories( $list_item[ 'id' ] );

//                 $chash[ $key ][ 'categories' ] = $categories;
//                 foreach ( $chash[ $key ][ 'categories' ] as $k => $category_item ) {
//                     $interests = get_interests( $list_item[ 'id' ], $category_item[ 'id' ] );       
//                     $chash[ $key ][ 'categories' ][ $k ][ 'interests' ] = $interests;
//                 }
//             }
//         }

//         if ( ! empty( $chash ) ) {
//             update_option( 'audiences_list_chash', $chash );
//         }
//     }

//     return $chash;
// }

// function get_interest_categories( $list_id ) {

//     global $mail_chimp;
//     $response = $mail_chimp->get( "lists/{$list_id}/interest-categories" );

//     if ( $mail_chimp->success() ) {
//         if ( isset( $response[ 'categories' ] ) ) {
//             $response = array_map( function ( $item ) {
//                 return array( 'id' => $item[ 'id' ], 'title' => $item[ 'title' ] );
//             }, $response[ 'categories' ] );
//         }        
//     } else {
//         $error = $mail_chimp->getLastError();
//         wp_send_json_error( $error );
//     }

//     return $response;
// }

// function get_interests( $list_id, $category_id ) {

//     global $mail_chimp;
//     $response = $mail_chimp->get( "lists/{$list_id}/interest-categories/{$category_id}/interests" );

//     if ( $mail_chimp->success() ) {
//         if ( isset( $response[ 'interests' ] ) ) {
//             $response = array_map( function ( $item ) {
//                 return array( 'id' => $item[ 'id' ], 'title' => $item[ 'name' ] );
//             }, $response[ 'interests' ] );
//         }
//     } else {
//         $error = $mail_chimp->getLastError();
//         wp_send_json_error( $error );
//     }
    
//     return $response;
// }

// function subscribe() {
//     $data = $_POST[ 'data' ];

//     $data = array();
//     parse_str( $_POST[ 'data' ], $data );

//     $email = $data[ 'email' ];

//     $interests_ids = json_decode( $data[ 'list_ids' ] );

//     $merge_vars = array();
//     $merge_vars[ 'email_address' ] = $email;
//     $merge_vars[ 'status' ] = 'subscribed';

//     $merge_vars[ 'merge_fields' ] = array();
//     if ( isset( $data[ 'first_name' ] ) ) {
//         $merge_vars[ 'merge_fields' ][ 'FNAME' ] = $data[ 'first_name' ];
//     }

//     if ( isset( $data[ 'last_name' ] ) ) {
//         $merge_vars[ 'merge_fields' ][ 'LNAME' ] = $data[ 'last_name' ];
//     }    
    
//     $merge_vars[ 'interests' ] = array();
//     foreach ( $interests_ids as $list ) {
//         $list = explode( '/', $list );
//         if ( count( $list ) > 1 ) {
//             $interest = $list[ 1 ];
//             $merge_vars[ 'interests' ][ $interest ] = true;
//         }
//     }

//     $api_key = get_option( 'getwid_mailchimp_api_key' );

//     global $mail_chimp;
//     $mail_chimp = new MailChimp( $api_key );

//     $list_id = '';
//     if ( ! strpos( $interests_ids[ 0 ], '/' ) ) {
//         $list_id = $interests_ids[ 0 ];
//     } else {
//         $interest = explode( '/', $interests_ids[ 0 ] );
//         $list_id = $interest[ 0 ];
//     }

//     $subscriber_hash = MailChimp::subscriberHash( $email );
//     $response = $mail_chimp->put( "lists/$list_id/members/$subscriber_hash", $merge_vars );

//     if ( $mail_chimp->success() ) {
//         wp_send_json_success(
//             __( 'Thank you for joining our mailing list.',
//             'getwid'
//         ) );
//     } else {
//         $error = $mail_chimp->getLastError();
//         wp_send_json_error( $error );
//     }
// }

/* #region register all blocks */
register_block_type(
    'getwid/mailchimp',
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