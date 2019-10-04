<?php

if ( !defined( 'ABSPATH' ) ) {
	exit;
}

require_once dirname( __FILE__ ) . '/functions.php';
require_once dirname( __FILE__ ) . '/translation.php';
require_once dirname( __FILE__ ) . '/settings.php';
require_once dirname( __FILE__ ) . '/getwid.php';
require_once dirname( __FILE__ ) . '/scripts-manager.php';
require_once dirname( __FILE__ ) . '/font-icons-manager/font-icons-manager.php';
require_once dirname( __FILE__ ) . '/blocks-manager.php';
require_once dirname( __FILE__ ) . '/version-control.php';
require_once dirname( __FILE__ ) . '/writing-settings.php';
require_once dirname( __FILE__ ) . '/rest-api.php';
require_once dirname( __FILE__ ) . '/post-template-part.php';
require_once dirname( __FILE__ ) . '/mailer.php';
require_once dirname( __FILE__ ) . '/allowed-css-tags.php';

if ( class_exists('\DrewM\MailChimp\MailChimp') === false ) {
	require_once dirname( __FILE__ ) . '/libraries/mailchimp-api/src/MailChimp.php';
}