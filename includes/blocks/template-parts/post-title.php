<?php

function render_getwid_template_post_title( $attributes, $content ) {
    //Not BackEnd render if we view from template page
    if ( (get_post_type() == Getwid\PostTemplatePart::$postType) || (get_post_type() == 'revision') ){
        return $content;
    }

    $block_name = 'wp-block-getwid-template-post-title';
    $wrapper_class = $block_name;

    $wrapper_style = '';
    //Classes
    if ( isset( $attributes['align'] ) ) {
        $wrapper_class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['textAlignment']) ) {
        $wrapper_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }      

    $is_back_end = \defined( 'REST_REQUEST' ) && REST_REQUEST && ! empty( $_REQUEST['context'] ) && 'edit' === $_REQUEST['context'];

    //Link style & class
    $title_style = '';
    $title_class = '';
    $link_class = esc_attr($block_name).'__link';
    //Color
    if (isset( $attributes['textColor']) || isset( $attributes['customTextColor'] )){
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
        if ($is_back_end){
            $title_style .= 'color: '.(isset( $attributes['customTextColor'] ) ? $attributes['customTextColor'] : $textColorHEX).';';
        } else {
            if (isset($attributes['customTextColor'])){
                $title_style .= 'color: '.$attributes['customTextColor'].';';
            } else {
                $title_class .= ' has-text-color has-' . $attributes['textColor'] . '-color';
            }
        }
    }
    $title_style = trim($title_style);
    $title_class = trim($title_class);
    $link_class = trim($link_class);

	$result = '';
	$headerTag = $attributes['headerTag'];
    
    $extra_attr = array(
        'wrapper_class' => $wrapper_class,
        'wrapper_style' => $wrapper_style,
        'headerTag' => $headerTag,
        'title_style' => $title_style,
        'title_class' => $title_class,
        'link_class' => $link_class,
    );

	if ( get_the_title() ) {
		ob_start();
        
            getwid_get_template_part('template-parts/post-title', $attributes, false, $extra_attr);

		$result = ob_get_clean();
	}

    return $result;
}
register_block_type(
    'getwid/template-post-title',
    array(
        'attributes' => array(
            //Colors
            'textColor' => array(
                'type' => 'string',
            ),
            'customTextColor' => array(
                'type' => 'string',
            ),
            //Colors

            'linkTo' => array(
                'type' => 'string',
                'default' => 'none',
            ),            
            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
            ),
            'headerTag' => array(
                'type' => 'string',
                'default' => 'h2',
            ),
        ),
        'render_callback' => 'render_getwid_template_post_title',
    )
);