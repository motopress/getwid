<?php

$main_block = 'mailchimp';

$HTTP_Code = 0;
$default_error_HTTP_Code = 400;
$errors = false;
$errorMessage;

add_action( 'wp_ajax_getwid_change_mailchimp_api_key' , 'getwid_change_mailchimp_api_key' );
add_action( 'wp_ajax_get_account_subscribe_lists'     , 'get_account_subscribe_lists'     );
add_action( 'wp_ajax_getwid_process_submission'       , 'getwid_process_submission'       );
add_action( 'wp_ajax_nopriv_getwid_process_submission', 'getwid_process_submission'       );

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

function getwid_change_mailchimp_api_key() {

    $nonce = $_POST[ 'nonce' ];

    if ( ! wp_verify_nonce( $nonce, 'getwid_nonce_mailchimp_api_key' ) ) {
        wp_send_json_error();
    }

    $data   = $_POST['data'  ];
    $option = $_POST['option'];
    
    $mailchimp_api_key = $data[ 'api_key' ];

    $response = false;
    if ( $option == 'save' || $option == 'sync' ) {
        if ( ! empty( $mailchimp_api_key ) ) {
            update_option( 'getwid_mailchimp_api_key', $mailchimp_api_key );

            $sync = false;
            if ( $option == 'sync' ) {
                $sync = true;

                global $HTTP_Code, $errorMessage;

                get_lists();
                if ( ! empty( $HTTP_Code ) && ( $HTTP_Code != 200 ) ) {
                    wp_send_json_error( get_response_message() );
                }
            }

            if ( ! empty( $mailchimp_api_key ) && empty( $errorMessage ) ) {
                $responce = get_account_subscribe_lists( $sync );
            }            
            
            wp_send_json_success( json_encode( $responce ) );
        }
    } elseif ( $option == 'delete' ) {
        delete_option( 'getwid_mailchimp_api_key' );
        delete_option( 'audiences_list_chash' );
    }
}

function get_lists() {    

    $api_key = get_option( 'getwid_mailchimp_api_key' );

    $dc = substr( $api_key, strpos( $api_key, '-' ) + 1 );
    $response = wp_remote_request( "https://{$dc}.api.mailchimp.com/3.0/lists" . "?" . "count=100&offset=0", array(
        'headers' => array(
            'Authorization' => 'Basic ' . base64_encode( 'API_KEY:' . $api_key ),
        ),
        'sslverify' => false
    ) );

    global $HTTP_Code, $default_error_HTTP_Code;

    if ( ! is_wp_error( $response ) ) {
        $HTTP_Code = wp_remote_retrieve_response_code( $response );
    } else {
        $HTTP_Code = $default_error_HTTP_Code;
    }

    if ( $HTTP_Code == 200 ) {
    
        $body = wp_remote_retrieve_body( $response );
        $body = json_decode( $body, true );        
        
        if ( isset( $body[ 'lists' ] ) ) {
            $body = array_map( function ( $item ) {
                return array( 'id' => $item[ 'id' ], 'title' => $item[ 'name' ] );
            }, $body[ 'lists' ] );
        } else {
            $body = array();
        }
    } else {
        return get_errors( $response );
    }

    return $body;
}

function get_account_subscribe_lists( $sync = false ) {    

    if ( ! $sync ) {
        $result = get_option( 'audiences_list_chash' );
    }

    if ( $sync || empty( $result ) ) {
        $result = array();

        $list = get_lists();        

        if ( isset( $list[ 'error' ] ) ) {
            return $list[ 'error' ];
        }

        if ( count( $list ) > 0 ) {
            $result = $list;
        
            foreach ( $list as $key => $list_item ) {
                $categories = get_interest_categories( $list_item[ 'id' ] );
                if ( isset( $categories[ 'error' ] ) ) {
                    return $categories;
                }
                
                $result[ $key ][ 'categories' ] = $categories;
                foreach ( $result[ $key ][ 'categories' ] as $k => $category_item ) {
                    $interests = get_interests( $list_item[ 'id' ], $category_item[ 'id' ] );
                    
                    if ( isset( $interests[ 'error' ] ) ) {
                        return $interests;
                    }
                    
                    $result[ $key ][ 'categories' ][ $k ][ 'interests' ] = $interests;
                }
            }
        }

        if ( ! empty( $result ) ) {
            update_option( 'audiences_list_chash', $result );
        }
    }
    
    return $result;
}

function get_interest_categories( $list_id ) {

    $api_key = get_option( 'getwid_mailchimp_api_key' );
    $dc      = substr( $api_key, strpos( $api_key, '-' ) + 1 );

    $request = wp_remote_get( "https://{$dc}.api.mailchimp.com/3.0/lists/{$list_id}/interest-categories" . "?" . "count=100&offset=0", array(
        'headers' => array(
            'Authorization' => 'Basic ' . base64_encode( 'API_KEY:' . $api_key ),
        ),
        'sslverify' => false
    ) );
    
    if ( wp_remote_retrieve_response_code( $request ) == 200 ) {
        $body = wp_remote_retrieve_body( $request );
        $body = json_decode( $body, true );
        
        if ( isset( $body[ 'categories' ] ) ) {
            $body = array_map( function ( $item ) {
                return array( 'id' => $item[ 'id' ], 'title' => $item[ 'title' ] );
            }, $body[ 'categories' ] );
        } else {
            $body = array();
        }
    }
    
    return $body;
}

function get_interests( $list_id, $category_id ) {
		
    $api_key = get_option( 'getwid_mailchimp_api_key' );
    $dc      = substr( $api_key, strpos( $api_key, '-' ) + 1 );

    $request = wp_remote_get( "https://{$dc}.api.mailchimp.com/3.0/lists/{$list_id}/interest-categories/{$category_id}/interests" . "?" . "count=100&offset=0", array(
        'headers'   => array(
            'Authorization' => 'Basic ' . base64_encode( 'API_KEY:' . $api_key ),
        ),
        'sslverify' => false
    ) );
    
    if ( wp_remote_retrieve_response_code( $request ) == 200 ) {
        $body = wp_remote_retrieve_body( $request );
        $body = json_decode( $body, true );
        
        if ( isset( $body[ 'interests' ] ) ) {
            $body = array_map( function ( $item ) {
                return array( 'id' => $item[ 'id' ], 'title' => $item[ 'name' ] );
            }, $body[ 'interests' ] );
        } else {
            $body = array();
        }
    }
    
    return $body;
}

function get_errors( $request ) {
    
    global $errorMessage;
    if ( is_wp_error( $request ) ) {
        $errorMessage = $content = $request->get_error_message();
    } else {
        $content      = json_decode( $request[ 'body' ], true );
        $errorMessage = $content = ( isset( $content[ 'detail' ] ) ) ? $content[ 'detail' ] : __( 'Data format error.', 'getwid' );
    }
    
    return array( 'error' => $content );
}

function get_response_message() {
    $default_message = __( 'Invalid MailChimp API key', 'getwid' );
    
    global $errorMessage, $HTTP_Code;
    $messages = array(
        '104' => __( 'Invalid MailChimp API key', 'getwid' ),
        '106' => __( 'Invalid MailChimp API key', 'getwid' ),
        '401' => $errorMessage,
        '403' => $errorMessage,
        '503' => __( 'Invalid MailChimp API key', 'getwid' )
    );
    
    if ( isset( $messages[ $HTTP_Code ] ) ) {
        $message = $messages[ $HTTP_Code ];
    }
    
    return empty( $message ) ? $default_message : $message;
}

function getwid_process_submission() {
    $data = $_POST[ 'data' ];

    $data = array();
    parse_str( $_POST[ 'data' ], $data );

    $email = $data[ 'email' ];

    $list_ids = json_decode( $data[ 'list_ids' ] );
    $merge_vars = array();

    $merge_vars[ 'merge_fields' ] = array();
    if ( isset( $data[ 'first_name' ] ) ) {
        $merge_vars[ 'merge_fields' ][ 'FNAME' ] = $data[ 'first_name' ];
    }

    if ( isset( $data[ 'last_name' ] ) ) {
        $merge_vars[ 'merge_fields' ][ 'LNAME' ] = $data[ 'last_name' ];
    }

    $merge_vars = getwid_prepare_mailchimp( $merge_vars, $list_ids );

    getwid_add_to_list( $email, $merge_vars );

    global $errors;
    if ( $errors ) {
        wp_send_json_error( __(
            'There was a problem processing your submission.',
            'getwid'
        ) );
    } else {
        wp_send_json_success(
            __( 'Thank you for joining our mailing list.',
            'getwid'
        ) );
    }
}

function getwid_prepare_mailchimp( $mailchimp_data, $list_ids ) {
    $mailchimp_data[ 'list_ids' ] = array();
    if ( ! empty( $list_ids ) ) {
        
        foreach ( $list_ids as $list ) {				
            $list = explode( '/', $list );
            if ( is_array( $list ) ) {
                
                $list_id     = $list[ 0 ];
                $interest_id = empty( $list[ 1 ] ) ? '' : $list[ 1 ];
                
                if ( ! isset( $mailchimp_data[ 'list_ids' ][ $list_id ] ) ) {
                    $mailchimp_data[ 'list_ids' ][ $list_id ] = array();
                }
                
                if ( ! empty( $interest_id ) && ! array_key_exists( $interest_id, $mailchimp_data[ 'list_ids' ][ $list_id ] ) ) {
                    $mailchimp_data[ 'list_ids' ][ $list_id ][ $interest_id ] = true;
                }
            }				
        }			
    }

    return $mailchimp_data;
}

function getwid_add_to_list( $email, $settings ) {
    $response = array();

    $lists = $settings[ 'list_ids' ];
    if ( $email ) {
        foreach ( $lists as $list_id => $interests ) {
            $data = array(
                'email_address' => $email,
                'status'        => 'subscribed',
            );

            if ( is_array( $interests ) && ! empty( $interests ) ) {
                $interests = array_map( function ( $item ) {
                    return $item == 'true';
                }, (array) $interests );					
            }

            if ( ! empty( $settings[ 'merge_fields' ] ) ) {
                $data[ 'merge_fields' ] = $settings[ 'merge_fields' ];
            }

            if ( ( isset( $interests[ 0 ] ) && ( $interests[ 0 ] == false ) || empty( $interests ) ) ) {
                $body = json_encode( $data );
            } else {
                $data[ 'interests' ] = $interests;
                $body                = json_encode( $data );
            }

            $response = getwid_put_user_to_list( $email, $list_id, $body, $response );
        }			
    }

    $body = array();
    if ( is_array( $response ) ) {
        
        check_response( $response[ 0 ] );
        
        foreach ( $response as $key => $response_item ) {
            if ( is_wp_error( $response_item ) ) {
                $body[ $key ][ 'response' ] = $response_item->get_error_message();
                $body[ $key ][ 'body' ]     = $response_item->get_error_code();
            } else {
                $body[ $key ][ 'response' ] = isset( $response_item[ 'response' ] ) ? $response_item[ 'response' ] : __( 'Unable to subscribe user.', 'getwid' );
                $body[ $key ][ 'body' ]     = isset( $response_item[ 'body' ] ) ? $response_item[ 'body' ] : '';
            }
        }
    }
}

function getwid_put_user_to_list( $email, $list_id, $body, $response ) {
    $api_key = get_option( 'getwid_mailchimp_api_key' );
    $dc      = substr( $api_key, strpos( $api_key, '-' ) + 1 );

    $response[] = wp_remote_post( "https://{$dc}.api.mailchimp.com/3.0/lists/{$list_id}/members/{member_hash($email)}", array(
        'headers'   => array(
            'Authorization' => 'Basic ' . base64_encode( 'API_KEY:' . $api_key ),
        ),
        'body'      => $body,
        'method'    => 'PUT',
        'sslverify' => false
    ) );
    
    return $response;
}

function check_response( $response ) {

    global $HTTP_Code, $default_error_HTTP_Code, $errorMessage, $errors;

    if ( is_wp_error( $response ) ) {
        $HTTP_Code = $default_error_HTTP_Code;
    } else {
        $HTTP_Code    = wp_remote_retrieve_response_code( $response );
        $errorMessage = wp_remote_retrieve_response_message( $response );
        
    }
    $errors = ( $HTTP_Code !== 200 ) ? true : false;
}

function member_hash( $email ) {
    return md5( strtolower( $email ) );
}

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