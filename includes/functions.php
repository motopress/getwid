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
	        extract( $attributes, EXTR_SKIP );
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

    $section_css = '';
	if ( $sectionContentWidth ) {
		$section_css .= '.wp-block-getwid-section .wp-block-getwid-section__wrapper .wp-block-getwid-section__inner-wrapper{max-width: '
		. $sectionContentWidth . 'px;}';
	}

	return $section_css;
}


/**
 * Generate text color/background color style & class
 *
 * @return string
 */
function getwid_custom_color_style_and_class(&$style = '', &$class = '', $attributes, $process = 'color', $is_back_end = false, $custom_color = false){

    if ($custom_color == false){
        if ($process == 'color'){
            //Color
            $Color = isset($attributes['textColor']) ? $attributes['textColor'] : null;
            $customColor = isset($attributes['customTextColor']) ? $attributes['customTextColor'] : null;
        } elseif ($process == 'background'){
            //Background
            $Color = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : null;
            $customColor = isset($attributes['customBackgroundColor']) ? $attributes['customBackgroundColor'] : null;
        }
    } elseif (is_array($custom_color)){
        $Color = isset($custom_color['color']) && isset($attributes[$custom_color['color']]) ? $attributes[$custom_color['color']] : null;
        $customColor = isset($custom_color['custom']) && isset($attributes[$custom_color['custom']]) ? $attributes[$custom_color['custom']] : null;
    }

    if (isset( $Color) || isset( $customColor )){
        if (isset( $Color)){
            preg_match('/^#/', $Color, $matches);
            //HEX
            $ColorHEX = '';
            if (isset($matches[0])){
                $ColorHEX = $Color;
            }
            //String
            else {
				$editorColorPalette = get_theme_support('editor-color-palette');
				if ( $editorColorPalette && isset($editorColorPalette[0]) ) {
					$get_colors = $editorColorPalette[0];
					if ( !empty($get_colors) ) {
						foreach ($get_colors as $key => $value) {
							if ($value['slug'] == $Color){
								$ColorHEX =  $value['color'];
							}
						}
					}
				}
            }
        }

        $class .= ($process == 'color') ? ' has-text-color' : ' has-background';

        if ($is_back_end){
            $style .= (($process == 'color') ? 'color:' : 'background-color:').(isset( $customColor ) ? $customColor : $ColorHEX).';';
        } else {
            if (isset($customColor)){
                $style .= (($process == 'color') ? 'color:' : 'background-color:'). esc_attr($customColor) .';';
            } else {
                $class .= ' has-'. esc_attr($Color) .(($process == 'color') ? '-color' : '-background-color');
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

    $class .= (isset($attributes['paddingTopTablet']) && $attributes['paddingTopTablet'] !='') ? " getwid-padding-tablet-top-".esc_attr($attributes['paddingTopTablet']) : '';
    $class .= (isset($attributes['paddingBottomTablet']) && $attributes['paddingBottomTablet'] !='') ? " getwid-padding-tablet-bottom-".esc_attr($attributes['paddingBottomTablet']) : '';
    $class .= (isset($attributes['paddingLeftTablet']) && $attributes['paddingLeftTablet'] !='') ? " getwid-padding-tablet-left-".esc_attr($attributes['paddingLeftTablet']) : '';
    $class .= (isset($attributes['paddingRightTablet']) && $attributes['paddingRightTablet'] !='') ? " getwid-padding-tablet-right-".esc_attr($attributes['paddingRightTablet']) : '';

    $class .= (isset($attributes['paddingTopMobile']) && $attributes['paddingTopMobile'] !='') ? " getwid-padding-mobile-top-".esc_attr($attributes['paddingTopMobile']) : '';
    $class .= (isset($attributes['paddingBottomMobile']) && $attributes['paddingBottomMobile'] !='') ? " getwid-padding-mobile-bottom-".esc_attr($attributes['paddingBottomMobile']) : '';
    $class .= (isset($attributes['paddingLeftMobile']) && $attributes['paddingLeftMobile'] !='') ? " getwid-padding-mobile-left-".esc_attr($attributes['paddingLeftMobile']) : '';
    $class .= (isset($attributes['paddingRightMobile']) && $attributes['paddingRightMobile'] !='') ? " getwid-padding-mobile-right-".esc_attr($attributes['paddingRightMobile']) : '';

    $style .= (isset($attributes['paddingTop']) && $attributes['paddingTop'] !='' && $attributes['paddingTop'] == 'custom') ? "padding-top:".esc_attr($attributes['paddingTopValue']).";" : '';
    $style .= (isset($attributes['paddingBottom']) && $attributes['paddingBottom'] !='' && $attributes['paddingBottom'] == 'custom') ? "padding-bottom:".esc_attr($attributes['paddingBottomValue']).";" : '';
    $style .= (isset($attributes['paddingLeft']) && $attributes['paddingLeft'] !='' && $attributes['paddingLeft'] == 'custom') ? "padding-left:".esc_attr($attributes['paddingLeftValue']).";" : '';
    $style .= (isset($attributes['paddingRight']) && $attributes['paddingRight'] !='' && $attributes['paddingRight'] == 'custom') ? "padding-right:".esc_attr($attributes['paddingRightValue']).";" : '';
}

/**
 * Generate custom alignment classes
 *
 * @return string
 */
function getwid_custom_alignment_classes(&$class = '', $attributes){
    $class .= (isset($attributes['verticalAlign']) && $attributes['verticalAlign'] !='center') ? " getwid-align-items-".esc_attr($attributes['verticalAlign']) : '';
    $class .= (isset($attributes['verticalAlignTablet']) && $attributes['verticalAlignTablet'] !='') ? " getwid-align-items-tablet".esc_attr($attributes['verticalAlignTablet']) : '';
    $class .= (isset($attributes['verticalAlignMobile']) && $attributes['verticalAlignMobile'] !='') ? " getwid-align-items-mobile-".esc_attr($attributes['verticalAlignMobile']) : '';

    $class .= (isset($attributes['horizontalAlign']) && $attributes['horizontalAlign'] !='center') ? " getwid-justify-content-".esc_attr($attributes['horizontalAlign']) : '';
    $class .= (isset($attributes['horizontalAlignTablet']) && $attributes['horizontalAlignTablet'] !='') ? " getwid-justify-content-tablet-".esc_attr($attributes['horizontalAlignTablet']) : '';
    $class .= (isset($attributes['horizontalAlignMobile']) && $attributes['horizontalAlignMobile'] !='') ? " getwid-justify-content-mobile-".esc_attr($attributes['horizontalAlignMobile']) : '';
}

/**
 * Generate custom gradient styles
 *
 * @return string
 */
function getwid_custom_gradient_styles($prefix = 'foreground', &$style = '', $attributes){
    $type = isset($attributes[$prefix.'GradientType']) ? esc_attr($attributes[$prefix.'GradientType']) : 'linear';
    $angle = isset($attributes[$prefix.'GradientAngle']) ? esc_attr($attributes[$prefix.'GradientAngle']).'deg' : '180deg';
    $firstColor = isset($attributes[$prefix.'GradientFirstColor']) ? esc_attr($attributes[$prefix.'GradientFirstColor']) : 'rgba(0,0,0,0)';
    $secondColor = isset($attributes[$prefix.'GradientSecondColor']) ? esc_attr($attributes[$prefix.'GradientSecondColor']) : 'rgba(0,0,0,0)';
    $firstLocation = isset($attributes[$prefix.'GradientFirstColorLocation']) ? esc_attr($attributes[$prefix.'GradientFirstColorLocation']).'%' : '0%';
    $secondLocation = isset($attributes[$prefix.'GradientSecondColorLocation']) ? esc_attr($attributes[$prefix.'GradientSecondColorLocation']).'%' : '100%';

    if ($type == 'linear'){
        $style .= 'background-image: linear-gradient('.esc_attr($angle).', '.esc_attr($firstColor).' '.esc_attr($firstLocation).', '.esc_attr($secondColor).' '.esc_attr($secondLocation).');';
    } elseif ($type == 'radial'){
        $style .= 'background-image: radial-gradient('.esc_attr($firstColor).' '.esc_attr($firstLocation).', '.esc_attr($secondColor).' '.esc_attr($secondLocation).');';
    }
}

/**
 * Build WP Query
 *
 * @return array
 */
function getwid_build_custom_post_type_query(&$query_args = [], $attributes, $options = []){

    if ((isset($attributes['filterById']) && $attributes['filterById'] != '') || (isset($attributes['parentPageId']) && $attributes['parentPageId'] != '' ) || isset($attributes['postType'])){

        $query_args = array(
            'posts_per_page'   => $attributes['postsToShow'],
            'ignore_sticky_posts' => 1,
            'post_status'      => 'publish',
            'order'            => $attributes['order'],
			'orderby'          => $attributes['orderBy'],
		);

        if ( isset($attributes['ignoreSticky']) ){
            $query_args['ignore_sticky_posts'] = $attributes['ignoreSticky'];
        }

        $paged = ( get_query_var( 'paged' ) ) ? absint( get_query_var( 'paged' ) ) : 1;
        if ( isset($attributes['pagination']) && $attributes['pagination'] ){
            $query_args['paged'] = $paged;
		}

		if ($attributes['offset'] != 0){
			$offset = ( $paged - 1 ) * $attributes['postsToShow'] + $attributes['offset'];
			$query_args['offset'] = $offset;
		}

    }

	 //Exclude by IDs && Current Post ID
	 if ((isset($attributes['excludeById']) && $attributes['excludeById'] != '') || $attributes['excludeCurrentPost']){

		$ids_arr = [];
		if ((isset($attributes['excludeById']) && $attributes['excludeById'] != '')){
			$ids_arr = array_map( 'intval', explode(',', $attributes['excludeById']) );
		}

		if ($attributes['excludeCurrentPost']){
			$ids_arr[] = get_the_ID();
		}

        $query_args['post__not_in'] = $ids_arr;
    }

    //Filter by IDs
    if (isset($attributes['filterById']) && $attributes['filterById'] != ''){

        $ids_arr = array_map( 'intval', explode(',', $attributes['filterById']) );
        $query_args['post__in'] = $ids_arr;

    } else if ((isset($attributes['parentPageId']) && $attributes['parentPageId'] !='') || $attributes['childPagesCurrentPage'] ){

        $query_args['post_type'] = 'page';
        if ($attributes['postType'] == 'page'){
			$query_args['post_parent'] = $attributes['childPagesCurrentPage'] ? get_the_ID() : intval($attributes['parentPageId']);
        }

    }

    //Set postType
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

					foreach ($terms_arr as $term_index => $term_id) {

						$query_args['tax_query'][] = array(
							'taxonomy' => $taxonomy_name,
							'field' => 'term_id',
							'terms' => $term_id
						);
					}
				}

            }
        }

	}

}

/**
 * Determine whether a post or content string has Getwid "nested" blocks.
 * @since 1.5.3
 */
function has_getwid_nested_blocks() {
	return getwid()->blocksManager()->hasGetwidNestedBlocks();
}

//TODO: Move/Remove?
function getwid_log( $caller = '', $data = '' ) {

	if ( ! GETWID_DEBUG ) return;

	if ( ! is_admin() && ! getwid()->is_rest_api_request() ) {

		echo '<small>' . $caller . ' : ';
			echo '<code>';
				if ( $data ) {
					echo '<span style="color:green">';
				} else {
					echo '<span style="color:red">';
				}
				var_dump( $data );

				echo '</span>';
			echo '</code>';
		echo '</small>';
		echo '<br/>';
	}
}