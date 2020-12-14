<?php

if ( !defined( 'ABSPATH' ) ) {
	exit;
}

require_once GETWID_PLUGIN_DIR . 'includes/functions.php';
require_once GETWID_PLUGIN_DIR . 'includes/translation.php';
require_once GETWID_PLUGIN_DIR . 'includes/settings.php';
require_once GETWID_PLUGIN_DIR . 'includes/scripts-manager.php';
require_once GETWID_PLUGIN_DIR . 'includes/font-icons-manager/font-icons-manager.php';
require_once GETWID_PLUGIN_DIR . 'includes/blocks-manager.php';
//require_once GETWID_PLUGIN_DIR . 'includes/token-manager.php';
require_once GETWID_PLUGIN_DIR . 'includes/version-control.php';
require_once GETWID_PLUGIN_DIR . 'includes/writing-settings.php';
require_once GETWID_PLUGIN_DIR . 'includes/rest-api.php';
require_once GETWID_PLUGIN_DIR . 'includes/post-template-part.php';
require_once GETWID_PLUGIN_DIR . 'includes/mailer.php';
require_once GETWID_PLUGIN_DIR . 'includes/allowed-css-tags.php';

if ( class_exists('\DrewM\MailChimp\MailChimp') === false ) {
	require_once GETWID_PLUGIN_DIR . 'includes/libraries/mailchimp-api/src/MailChimp.php';
}