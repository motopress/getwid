<?php

/**
 * Gets plugin's absolute directory path.
 *
 * @param string $path Relative path
 *
 * @return string
 */
function getwid_get_plugin_path( $path = '' ) {
	$basePath = dirname( GETWID_PLUGIN_FILE );

	return $basePath . $path;
}

/**
 * Gets plugin's URL.
 *
 * @param string $path
 *
 * @return string
 */
function getwid_get_plugin_url( $path = '' ) {
	return plugins_url( $path, GETWID_PLUGIN_FILE );
}