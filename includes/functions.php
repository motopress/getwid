<?php

/**
 * Gets plugin's absolute directory path.
 *
 * @param string $path Relative path
 *
 * @return string
 */
function getwid_get_plugin_path( $path = '' ) {
	return GETWID_PLUGIN_DIR . trim( $path, '/' );
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


/**
* Get template part.
*
* @param string $slug
* @param string $name Optional. Default ''.
*/
function getwid_get_template_part( $slug, $attributes = array(), $extract = false, $extra_attr = array() ){

    $template = '';

    // Look in %theme_dir%/%template_path%/slug.php
    $template = locate_template( "getwid/{$slug}.php" );

    // Get default template from plugin
    if ( empty( $template ) && file_exists( getwid_get_plugin_path( "/includes/templates/{$slug}.php" ) ) ) {
        $template = getwid_get_plugin_path( "/includes/templates/{$slug}.php" );
    }

    // Allow 3rd party plugins to filter template file from their plugin.
    $template = apply_filters( 'getwid_get_template_part', $template, $slug, $attributes );

    if ( !empty( $template ) ) {
	    if ( $attributes && is_array( $attributes ) && $extract ) {
	        extract( $attributes );
	    }

	    require $template;
    }
}

/**
 * Generate section content width css
 *
 * @return string
 */
function getwid_generate_section_content_width_css(){

	global $content_width;

	$section_css = '
		.wp-block-getwid-section .wp-block-getwid-section__wrapper .wp-block-getwid-section__inner-wrapper{
			max-width: '.get_option('getwid_section_content_width', $content_width).'px;
		}
	';

	return $section_css;
}
