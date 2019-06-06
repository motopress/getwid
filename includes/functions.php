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

/**
 * Generate custom paddings style & class
 *
 * @return string
 */
function getwid_custom_paddings_style_and_class(&$style = '', &$class = '', $attributes){

    $class .= (isset($attributes['paddingTop']) && $attributes['paddingTop'] !='' && $attributes['paddingTop'] != 'custom') ? " getwid-padding-top-".esc_attr($attributes['paddingTop']) : '';
    $class .= (isset($attributes['paddingBottom']) && $attributes['paddingBottom'] !='' && $attributes['paddingBottom'] != 'custom') ? " getwid-padding-bottom-".esc_attr($attributes['paddingBottom']) : '';
    $class .= (isset($attributes['paddingLeft']) && $attributes['paddingLeft'] !='' && $attributes['paddingLeft'] != 'custom') ? " getwid-padding-left-".esc_attr($attributes['paddingLeft']) : '';
    $class .= (isset($attributes['paddingRight']) && $attributes['paddingRight'] !='' && $attributes['paddingRight'] != 'custom') ? " getwid-padding-right-".esc_attr($attributes['paddingRight']) : '';
    
    $class .= (isset($attributes['paddingTopTablet']) && $attributes['paddingTopTablet'] !='' && $attributes['paddingTopTablet'] != 'custom') ? " getwid-padding-tablet-top-".esc_attr($attributes['paddingTopTablet']) : '';
    $class .= (isset($attributes['paddingBottomTablet']) && $attributes['paddingBottomTablet'] !='' && $attributes['paddingBottomTablet'] != 'custom') ? " getwid-padding-tablet-bottom-".esc_attr($attributes['paddingBottomTablet']) : '';
    $class .= (isset($attributes['paddingLeftTablet']) && $attributes['paddingLeftTablet'] !='' && $attributes['paddingLeftTablet'] != 'custom') ? " getwid-padding-tablet-left-".esc_attr($attributes['paddingLeftTablet']) : '';
    $class .= (isset($attributes['paddingRightTablet']) && $attributes['paddingRightTablet'] !='' && $attributes['paddingRightTablet'] != 'custom') ? " getwid-padding-tablet-right-".esc_attr($attributes['paddingRightTablet']) : '';
    
    $class .= (isset($attributes['paddingTopMobile']) && $attributes['paddingTopMobile'] !='' && $attributes['paddingTopMobile'] != 'custom') ? " getwid-padding-mobile-top-".esc_attr($attributes['paddingTopMobile']) : '';
    $class .= (isset($attributes['paddingBottomMobile']) && $attributes['paddingBottomMobile'] !='' && $attributes['paddingBottomMobile'] != 'custom') ? " getwid-padding-mobile-bottom-".esc_attr($attributes['paddingBottomMobile']) : '';
    $class .= (isset($attributes['paddingLeftMobile']) && $attributes['paddingLeftMobile'] !='' && $attributes['paddingLeftMobile'] != 'custom') ? " getwid-padding-mobile-left-".esc_attr($attributes['paddingLeftMobile']) : '';
    $class .= (isset($attributes['paddingRightMobile']) && $attributes['paddingRightMobile'] !='' && $attributes['paddingRightMobile'] != 'custom') ? " getwid-padding-mobile-right-".esc_attr($attributes['paddingRightMobile']) : '';
    
    $style .= (isset($attributes['paddingTop']) && $attributes['paddingTop'] !='' && $attributes['paddingTop'] == 'custom') ? "padding-top:".esc_attr($attributes['paddingTopValue']).";" : '';
    $style .= (isset($attributes['paddingBottom']) && $attributes['paddingBottom'] !='' && $attributes['paddingBottom'] == 'custom') ? "padding-bottom:".esc_attr($attributes['paddingBottomValue']).";" : '';
    $style .= (isset($attributes['paddingLeft']) && $attributes['paddingLeft'] !='' && $attributes['paddingLeft'] == 'custom') ? "padding-left:".esc_attr($attributes['paddingLeftValue']).";" : '';
    $style .= (isset($attributes['paddingRight']) && $attributes['paddingRight'] !='' && $attributes['paddingRight'] == 'custom') ? "padding-right:".esc_attr($attributes['paddingRightValue']).";" : '';

}


/**
 * Build WP Query
 *
 * @return array
 */
function getwid_build_custom_post_type_query(&$query_args = [], $attributes, $options = []){

    if ((isset($attributes['filterById']) && $attributes['filterById'] != '') || (isset($attributes['parentPageId']) && is_numeric($attributes['parentPageId'])) || isset($attributes['postType'])){

        $query_args = array(
            'posts_per_page'   => $attributes['postsToShow'],
            'ignore_sticky_posts' => 1,
            'post_status'      => 'publish',
            'order'            => $attributes['order'],
            'orderby'          => $attributes['orderBy'],
        );

        if ( isset($options['exclude_current']) && $options['exclude_current'] ){
            $query_args['post__not_in'] = array($attributes['currentID']);
        }    
    
        if ( isset($attributes['ignoreSticky']) ){
            $query_args['ignore_sticky_posts'] = $attributes['ignoreSticky'];
        }    
    
        $paged = ( get_query_var( 'paged' ) ) ? absint( get_query_var( 'paged' ) ) : 1;
        if ( isset($attributes['pagination']) && $attributes['pagination'] ){
            $query_args['paged'] = $paged;
        }

    }

    //Filter by IDs
    if (isset($attributes['filterById']) && $attributes['filterById'] != ''){

        $ids_arr = explode(',', $attributes['filterById']);
        $query_args['post__in'] = $ids_arr;

    } else if (isset($attributes['parentPageId']) && is_numeric($attributes['parentPageId'])){

        $query_args['post_type'] = 'page';
        $query_args['post_parent'] = $attributes['parentPageId'];

    } else {

        if ( isset($attributes['postType'])){

            $query_args['post_type'] = $attributes['postType'];

            if ( isset($attributes['taxonomy']) && isset($attributes['terms']) ){
        
                $query_args['tax_query'] = array(
                    'relation' => $attributes['relation'],
                );
        
                $taxonomy_arr = [];
                //Get terms from taxonomy (Make arr)
                foreach ($attributes['terms'] as $key => $value) {
                    preg_match('/(^.*)\[(\d*)\]/', $value, $find_arr);
        
                    if (isset($find_arr[1]) && isset($find_arr[2])){                
                        $taxonomy = $find_arr[1];
                        $term = $find_arr[2];
        
                        $taxonomy_arr[$taxonomy][] = $term;
                    }
                }
        
                //Add array to query
                if (!empty($taxonomy_arr)){
                    foreach ($taxonomy_arr as $taxonomy_name => $terms_arr) {                    
                        $query_args['tax_query'][] = array(
                            'taxonomy' => $taxonomy_name,
                            'field' => 'term_id',
                            'terms' => $terms_arr
                        );
                    }
                }
        
            }
    
        }

    }

}