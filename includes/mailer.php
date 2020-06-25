<?php

namespace Getwid;

class Mailer {

	public function __construct() {
	}

	/**
	 * Send an email.
	 * @param string|array $to Array or comma-separated list of email addresses to send message.
	 * @param string $subject
	 * @param string $message
	 * @param array|string $headers Optional. Additional headers.
	 * @param array|string $attachments Optional. Files to attach.
	 * @return bool success
	 */
	public function send( $to, $subject, $message, $headers = null, $attachments = null ){

		add_filter( 'wp_mail_content_type', array( $this, 'filterContentType' ) );

		$result = wp_mail( $to, $subject, $message, $headers, $attachments );

		remove_filter( 'wp_mail_content_type', array( $this, 'filterContentType' ) );

		return $result;
	}

	/**
	 * Filter email content type.
	 *
	 * @param string $contentType
	 *
	 * @return string
	 */
	public function filterContentType( $contentType ){
		return 'text/html';
	}

}
