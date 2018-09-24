<?php

namespace Getwid;

/**
 * Class ScriptsManager
 * @package Getwid
 */
class ScriptsManager {

	private $version;
	private $prefix;

	/**
	 * ScriptsManager constructor.
	 *
	 * @param Settings $settings Plugin settings
	 *
	 */
	public function __construct( $settings ) {
		$this->version = $settings->getVersion();
		$this->prefix  = $settings->getPrefix();

		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueueEditorAssets' ] );
		add_action( 'enqueue_block_assets', [ $this, 'enqueueBlockAssets' ] );
		add_action( 'enqueue_block_assets', [ $this, 'enqueueFrontBlockAssets' ] );
	}

	/**
	 * Enqueue editor-only js and css
	 */
	public function enqueueEditorAssets() {

		// Enqueue the bundled block JS file
		wp_enqueue_script(
			"{$this->prefix}-blocks-js",
			getwid_get_plugin_url( 'assets/js/editor.blocks.js' ),
			[
				'wp-i18n',
				'wp-element',
				'wp-blocks',
				'wp-components',
			],
			$this->version
		);

		// Enqueue optional editor only styles
		wp_enqueue_style(
			"{$this->prefix}-blocks-editor-css",
			getwid_get_plugin_url( 'assets/css/blocks.editor.css' ),
			[ 'wp-blocks' ],
			$this->version
		);
	}

	/**
	 * Enqueue editor & frontend js and css
	 */
	public function enqueueBlockAssets() {
		wp_enqueue_style(
			"{$this->prefix}-blocks",
			getwid_get_plugin_url( 'assets/css/blocks.style.css' ),
			[ 'wp-blocks' ],
			$this->version
		);
	}

	/**
	 * Enqueue frontend-only block js and css
	 */
	public function enqueueFrontBlockAssets() {
		if ( is_admin() ) {
			return;
		}

		wp_enqueue_script(
			"{$this->prefix}-blocks-frontend",
			getwid_get_plugin_url( 'assets/js/frontend.blocks.js' ),
			[],
			$this->version
		);
	}

}