<?php

namespace Getwid;

/**
 * Class AllowedCssTags
 * @package Getwid
 */
class AllowedCssTags {

	private static $instance = null;

	/**
	 * AllowedCssTags constructor.
	 */
	public function __construct() {
		add_filter( 'safe_style_css', [ $this, 'allowed_css' ],  20);
		$this->allowed_tags();
	}

	public static function getInstance()
	{
		if (self::$instance == null)
		{
			self::$instance = new AllowedCssTags();
		}
		return self::$instance;
	}

	public function allowed_tags() {
		global $allowedposttags;

		$allowedposttags['canvas'] = array(
			'class'      => array(),
			'id'         => array(),
			'style'      => array(),
			'width'      => array(),
			'height'     => array(),
		);
	}

	public function allowed_css($allowed_attr) {

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
