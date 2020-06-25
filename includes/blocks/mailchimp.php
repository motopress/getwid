<?php

namespace Getwid\Blocks;

use DrewM\MailChimp\MailChimp as MC;

class MailChimp extends \Getwid\Blocks\AbstractBlock {

    private $mailchimp;

	protected static $blockName = 'getwid/mailchimp';

    public function __construct() {

		parent::__construct( self::$blockName );

        add_action( 'wp_ajax_getwid_mailchimp_api_key_manage', [ $this, 'mailchimp_api_key_manage'] );

        add_action( 'wp_ajax_getwid_subscribe'       , [ $this, 'subscribe' ] );
        add_action( 'wp_ajax_nopriv_getwid_subscribe', [ $this, 'subscribe' ] );

        $this->register_mailchimp_blocks();
    }

	public function getLabel() {
		return __('Mailchimp', 'getwid');
	}

    private function register_mailchimp_blocks() {

        /* #region register all blocks */
        register_block_type(
            'getwid/mailchimp',
            array(
                'render_callback' => [ $this, 'render_callback' ]
            )
        );

		$field_email = 'getwid/mailchimp-field-email';
        register_block_type(
            $field_email,
            array(
                'render_callback' => [ $this, 'render_mailchimp_field_email' ]
            )
        );

		$field_first_name = 'getwid/mailchimp-field-first-name';
        register_block_type(
            $field_first_name,
            array(
                'render_callback' => [ $this, 'render_mailchimp_field_first_name' ]
            )
        );

		$field_last_name = 'getwid/mailchimp-field-last-name';
        register_block_type(
            $field_last_name,
            array(
                'render_callback' => [ $this, 'render_mailchimp_field_last_name' ]
            )
        );
        /* #endregion */
    }

    public function render_callback( $attributes, $content ) {

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

    /* #region render inner blocks methods */
    public function render_mailchimp_field_email( $attributes ) {
        ob_start();?>
        <?php getwid_get_template_part( 'mailchimp/field-email', $attributes, false ); ?><?php

        $chash = ob_get_clean();
        return $chash;
    }

    public function render_mailchimp_field_first_name( $attributes ) {
        $extra_attr = array( 'name' => 'first_name' );

        if ( ! isset( $attributes[ 'label' ] ) ) {
            $attributes[ 'label' ] = __( 'First name', 'getwid' );
        }

        ob_start();?>
        <?php getwid_get_template_part( 'mailchimp/field-first-name', $attributes, false, $extra_attr ); ?><?php

        $chash = ob_get_clean();
        return $chash;
    }

    public function render_mailchimp_field_last_name( $attributes ) {
        $extra_attr = array( 'name' => 'last_name' );

        if ( ! isset( $attributes[ 'label' ] ) ) {
            $attributes[ 'label' ] = __( 'Last name', 'getwid' );
        }

        ob_start();?>
        <?php getwid_get_template_part( 'mailchimp/field-last-name', $attributes, false, $extra_attr ); ?><?php

        $chash = ob_get_clean();
        return $chash;
    }
    /* #endregion */

    public function mailchimp_api_key_manage() {
        $nonce = $_POST[ 'nonce' ];

        if ( ! wp_verify_nonce( $nonce, 'getwid_nonce_mailchimp_api_key' ) ) {
            wp_send_json_error();
        }

        $data   = $_POST[ 'data'   ];
        $option = $_POST[ 'option' ];

        $api_key = trim( $data[ 'api_key' ] );

        if ( $option == 'save' || $option == 'sync' ) {
            if ( ! empty( $api_key ) ) {
                update_option( 'getwid_mailchimp_api_key', $api_key );

                try {
                    $this->mailchimp = new MC( $api_key );
                } catch ( \Exception $exception ) {
                    wp_send_json_error( $exception->getMessage() );
                }

                $sync = false;
                if ( $option == 'sync' ) {
                    $sync = true;

                    $this->get_lists();
                }

                $chash = $this->get_account_subscribe_lists( $sync );

                wp_send_json_success( $chash );
            }
        } elseif ( $option == 'delete' ) {
            delete_option( 'getwid_mailchimp_api_key' );
            delete_option( 'audiences_list_chash'     );
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
            $cache = get_option( 'audiences_list_chash' );
        }

        if ( $sync || empty( $cache ) ) {
            $cache = array();

            $list = $this->get_lists();

            if ( count( $list ) > 0 ) {
                $cache = $list;

                foreach ( $list as $key => $list_item ) {
                    $categories = $this->get_interest_categories( $list_item[ 'id' ] );

                    $cache[ $key ][ 'categories' ] = $categories;
                    foreach ( $cache[ $key ][ 'categories' ] as $k => $category_item ) {
                        $interests = $this->get_interests( $list_item[ 'id' ], $category_item[ 'id' ] );
                        $cache[ $key ][ 'categories' ][ $k ][ 'interests' ] = $interests;
                    }
                }
            }

            if ( ! empty( $cache ) ) {
                update_option( 'audiences_list_chash', $cache );
            }
        }

        return $cache;
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

		parse_str( $_POST[ 'data' ], $data );

		$email = ! empty( $data[ 'email' ] ) ? sanitize_email( trim( $data[ 'email' ] ) ) : '';

        if ( empty( $email ) || ! is_email( $email ) ) {
            wp_send_json_error( __('Email is required.', 'getwid') );
        }

		if ( empty( $data[ 'list_ids' ] ) ) {
            wp_send_json_error( __('An invalid Mailchimp list was provided.', 'getwid') );
        }

        $interests_ids = json_decode( $data[ 'list_ids' ] );

        $merge_vars = array();
        $merge_vars[ 'email_address' ] = $email;
        $merge_vars[ 'status' ] = 'subscribed';

        $merge_vars[ 'merge_fields' ] = array();
        if ( isset( $data[ 'first-name' ] ) ) {
            $merge_vars[ 'merge_fields' ][ 'FNAME' ] = $data[ 'first-name' ];
        }

        if ( isset( $data[ 'last-name' ] ) ) {
            $merge_vars[ 'merge_fields' ][ 'LNAME' ] = $data[ 'last-name' ];
        }

        if ( empty( $merge_vars[ 'merge_fields' ] ) ) {
            unset( $merge_vars[ 'merge_fields' ] );
        }

        $merge_vars[ 'interests' ] = array();
        foreach ( $interests_ids as $list ) {
            $list = explode( '/', $list );

            list( $first, $second ) = $list;
            if ( isset( $second ) ) {
                $merge_vars[ 'interests' ][ $second ] = true;
            }
        }

		if ( empty( $merge_vars[ 'interests' ] ) ) {
			unset( $merge_vars[ 'interests' ] );
		}

        if ( ! strpos( $interests_ids[ 0 ], '/' ) ) {
            list( $list_id, ) = $interests_ids;
        } else {
            $interest = explode( '/', $interests_ids[ 0 ] );
            list( $list_id, ) = $interest;
        }

        $api_key = get_option( 'getwid_mailchimp_api_key' );

        try {
            $this->mailchimp = new MC( $api_key );
        } catch ( \Exception $exception ) {
            wp_send_json_error( $exception->getMessage() );
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

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\MailChimp()
);
