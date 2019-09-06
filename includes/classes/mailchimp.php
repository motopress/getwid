<?php

namespace Getwid\MailChimp;

use DrewM\MailChimp\MailChimp as MC;

class MailChimp {

    public $mailchimp;

    public function __construct( $api_key ) {
        try {
			$this->mailchimp = new MC( $api_key );
		} catch ( \Exception $exception ) {
            throw new \Exception( $exception->getMessage() );
		}
    }

    public function get_lists() {

        $response = $this->mailchimp->get( 'lists' );
    
        if ( $this->mailchimp->success() ) {
            if ( isset( $response[ 'lists' ] ) ) {
                $response = array_map( function ( $item ) {
                    return array( 'id' => $item[ 'id' ], 'title' => $item[ 'name' ] );
                }, $response[ 'lists' ] );
            }        
        } else {
            $error = $this->mailchimp->getLastError();
            wp_send_json_error( $error );
        }
    
        return $response;
    }
    
    public function get_account_subscribe_lists( $sync = false ) {
    
        if ( ! $sync ) {
            $chash = get_option( 'audiences_list_chash' );
        }    
    
        if ( $sync || empty( $chash ) ) {
            $chash = array();
    
            $list = $this->get_lists();
    
            if ( count( $list ) > 0 ) {
                $chash = $list;
            
                foreach ( $list as $key => $list_item ) {
                    $categories = $this->get_interest_categories( $list_item[ 'id' ] );
    
                    $chash[ $key ][ 'categories' ] = $categories;
                    foreach ( $chash[ $key ][ 'categories' ] as $k => $category_item ) {
                        $interests = $this->get_interests( $list_item[ 'id' ], $category_item[ 'id' ] );       
                        $chash[ $key ][ 'categories' ][ $k ][ 'interests' ] = $interests;
                    }
                }
            }
    
            if ( ! empty( $chash ) ) {
                update_option( 'audiences_list_chash', $chash );
            }
        }        
    
        return $chash;
    }
    
    private function get_interest_categories( $list_id ) {
        $response = $this->mailchimp->get( "lists/{$list_id}/interest-categories" );
    
        if ( $this->mailchimp->success() ) {
            if ( isset( $response[ 'categories' ] ) ) {
                $response = array_map( function ( $item ) {
                    return array( 'id' => $item[ 'id' ], 'title' => $item[ 'title' ] );
                }, $response[ 'categories' ] );
            }        
        } else {
            $error = $this->mailchimp->getLastError();
            wp_send_json_error( $error );
        }
    
        return $response;
    }
    
    private function get_interests( $list_id, $category_id ) {
        $response = $this->mailchimp->get( "lists/{$list_id}/interest-categories/{$category_id}/interests" );
    
        if ( $this->mailchimp->success() ) {
            if ( isset( $response[ 'interests' ] ) ) {
                $response = array_map( function ( $item ) {
                    return array( 'id' => $item[ 'id' ], 'title' => $item[ 'name' ] );
                }, $response[ 'interests' ] );
            }
        } else {
            $error = $this->mailchimp->getLastError();
            wp_send_json_error( $error );
        }
        
        return $response;
    }
    
    public function subscribe() {
        $data = array();
        parse_str( $_POST[ 'data' ], $data );
    
        $email = $data[ 'email' ];
        $interests_ids = json_decode( $data[ 'list_ids' ] );
    
        $merge_vars = array();
        $merge_vars[ 'email_address' ] = $email;
        $merge_vars[ 'status' ] = 'subscribed';
    
        $merge_vars[ 'merge_fields' ] = array();
        if ( isset( $data[ 'first_name' ] ) ) {
            $merge_vars[ 'merge_fields' ][ 'FNAME' ] = $data[ 'first_name' ];
        }
    
        if ( isset( $data[ 'last_name' ] ) ) {
            $merge_vars[ 'merge_fields' ][ 'LNAME' ] = $data[ 'last_name' ];
        }

        if ( empty( $merge_vars[ 'merge_fields' ] ) ) {
            unset( $merge_vars[ 'merge_fields' ] );
        }
        
        $merge_vars[ 'interests' ] = array();
        foreach ( $interests_ids as $list ) {
            $list = explode( '/', $list );
            if ( count( $list ) > 1 ) {
                $interest = $list[ 1 ];
                $merge_vars[ 'interests' ][ $interest ] = true;
            }
        }

        if ( ! strpos( $interests_ids[ 0 ], '/' ) ) {
            list( $list_id, ) = $interests_ids;
        } else {
            $interest = explode( '/', $interests_ids[ 0 ] );
            list( $list_id, ) = $interest;
        }
    
        $subscriber_hash = MC::subscriberHash( $email );
        $response = $this->mailchimp->put( "lists/$list_id/members/$subscriber_hash", $merge_vars );
    
        if ( $this->mailchimp->success() ) {
            wp_send_json_success(
                __( 'Thank you for joining our mailing list.',
                'getwid'
            ) );
        } else {
            $error = $this->mailchimp->getLastError();
            wp_send_json_error( $error );
        }
    }
}