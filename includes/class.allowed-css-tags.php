<?php

namespace Getwid;

/**
 * Class AllowedCssTags
 * @package Getwid
 */
class AllowedCssTags {

	/**
	 * AllowedCssTags constructor.
	 */
	public function __construct() {	
		add_filter( 'safe_style_css', [ $this, 'getwid_allowed_css' ],  20);
		$this->getwid_allowed_tags();
	}

	public function getwid_allowed_tags() {
		global $allowedposttags;

		$allowedposttags['canvas'] = array(
			'class'      => array(),
			'id'         => array(),
			'style'      => array(),
			'width'      => array(),
			'height'     => array(),
		);
	}
	
	public function getwid_allowed_css($allowed_attr) {

		$new_allowed_attr = array(
			'background-position',
			'background-attachment',
			'background-size',
			'background-repeat',
			
			'opacity',
			'flex-direction',
			'flex-wrap',
			'justify-content',
			'align-content',
			'align-items',
			'order',
			'flex',
			'align-self',
		);

		foreach ($new_allowed_attr as $key => $value) {
			if (!in_array($value, $allowed_attr)){
				$allowed_attr[] = $value;
			}
		}

		return $allowed_attr;
	}

}