<?php

if ( !defined( 'ABSPATH' ) ) {
	exit;
}

require_once dirname( __FILE__ ) . '/functions.php';
require_once dirname( __FILE__ ) . '/translation.php';
require_once dirname( __FILE__ ) . '/class.settings.php';
require_once dirname( __FILE__ ) . '/class.getwid.php';
require_once dirname( __FILE__ ) . '/class.scripts-manager.php';
require_once dirname( __FILE__ ) . '/font-icons-manager/class.font-icons-manager.php';
require_once dirname( __FILE__ ) . '/class.blocks-manager.php';
require_once dirname( __FILE__ ) . '/class.version-control.php';
require_once dirname( __FILE__ ) . '/class.writing-settings.php';
require_once dirname( __FILE__ ) . '/class.rest-api.php';
require_once dirname( __FILE__ ) . '/class.post-template-part.php';
require_once dirname( __FILE__ ) . '/class.mailer.php';
require_once dirname( __FILE__ ) . '/class.allowed-css-tags.php';

if ( class_exists('\DrewM\MailChimp\MailChimp') === false ) {
	require_once dirname( __FILE__ ) . '/libraries/mailchimp-api/src/MailChimp.php';
}