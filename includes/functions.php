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

    $template = getwid_locate_template( $slug );

    // Allow 3rd party plugins to filter template file from their plugin.
    $template = apply_filters( 'getwid/core/get_template_part', $template, $slug, $attributes );

    if ( !empty( $template ) ) {
	    if ( $attributes && is_array( $attributes ) && $extract ) {
	        extract( $attributes );
	    }

	    require $template;
    }

	return $template;
}

/**
* Retrieve the name of the highest priority template file that exists.
*
* @param string $slug
* @param string $name Optional. Default ''.
*/
function getwid_locate_template( $slug ){

    $template = '';

    // Look in %theme_dir%/%template_path%/slug.php
    $template = locate_template( "getwid/{$slug}.php" );

    // Get default template from plugin
    if ( empty( $template ) && file_exists( getwid_get_plugin_path( "/includes/templates/{$slug}.php" ) ) ) {
        $template = getwid_get_plugin_path( "/includes/templates/{$slug}.php" );
    }

	return $template;
}

/**
 * Generate section content width css
 *
 * @return string
 */
function getwid_generate_section_content_width_css(){

	global $content_width;

    // Existent empty option value "" = non-existent option value
	$sectionContentWidth = get_option( 'getwid_section_content_width', '' );
    // We need to know exactly when the value "does not exist" and when to set the global value
    $sectionContentWidth = is_numeric($sectionContentWidth) ? floatval( $sectionContentWidth ) : $content_width;

	if ( $sectionContentWidth ) {
		$section_css = '.wp-block-getwid-section .wp-block-getwid-section__wrapper .wp-block-getwid-section__inner-wrapper{max-width: '
		. $sectionContentWidth . 'px;}';
	}

	return $section_css;
}


/**
 * Generate text color/background color style & class
 *
 * @return string
 */
function getwid_custom_color_style_and_class(&$style = '', &$class = '', $attributes, $process = 'color', $is_back_end = false){

    //Color
    if ($process == 'color'){
        if (isset( $attributes['textColor']) || isset( $attributes['customTextColor'] )){
            if (isset( $attributes['textColor'])){
                preg_match('/^#/', $attributes['textColor'], $matches);
                //HEX
                $textColorHEX = '';
                if (isset($matches[0])){
                    $textColorHEX = $attributes['textColor'];
                }
                //String
                else {
                    $get_colors = get_theme_support('editor-color-palette')[0];
                    foreach ($get_colors as $key => $value) {
                        if ($value['slug'] == $attributes['textColor']){
                            $textColorHEX =  $value['color'];
                        }
                    }        
                }
            }
            if ($is_back_end){
                $style .= 'color: '.(isset( $attributes['customTextColor'] ) ? $attributes['customTextColor'] : $textColorHEX).';';
            } else {
                if (isset($attributes['customTextColor'])){
                    $style .= 'color: '.$attributes['customTextColor'].';';
                } else {
                    $class .= ' has-text-color has-' . $attributes['textColor'] . '-color';
                }
            }
        }
    }

    //Baclground
    if ($process == 'background'){
        if (isset( $attributes['backgroundColor']) || isset( $attributes['customBackgroundColor'] )){
            if (isset( $attributes['backgroundColor'])){
                preg_match('/^#/', $attributes['backgroundColor'], $matches);
                //HEX
                $backgroundColorHEX = '';
                if (isset($matches[0])){
                    $backgroundColorHEX = $attributes['backgroundColor'];
                }
                //String
                else {
                    $get_colors = get_theme_support('editor-color-palette')[0];
                    foreach ($get_colors as $key => $value) {
                        if ($value['slug'] == $attributes['backgroundColor']){
                            $backgroundColorHEX =  $value['color'];
                        }
                    }        
                } 
            }
            if ($is_back_end){
                $style .= 'background-color: '.(isset( $attributes['customBackgroundColor'] ) ? $attributes['customBackgroundColor'] : $backgroundColorHEX).';';
            } else {
                if (isset($attributes['customBackgroundColor'])){
                    $style .= 'background-color: '.$attributes['customBackgroundColor'].';';
                } else {
                    $class .= ' has-background has-' . $attributes['backgroundColor'] . '-background-color';
                }
            } 
        }
    }

    $style = trim($style);
    $class = trim($class);
}