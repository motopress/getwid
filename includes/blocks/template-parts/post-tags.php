<?php

function render_getwid_template_post_tags( $attributes, $content ) {
    //Not BackEnd render if we view from template page
    if ( (get_post_type() == Getwid\PostTemplatePart::$postType) || (get_post_type() == 'revision') ){
        return $content;
    }

    $block_name = 'wp-block-getwid-template-post-tags';
    $wrapper_class = $block_name;

    $wrapper_style = '';
    //Classes
    if ( isset( $attributes['align'] ) ) {
        $wrapper_class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['textAlignment']) ) {
        $wrapper_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }      

    if ( isset( $attributes['customFontSize']) ) {
        $wrapper_style .= 'font-size: '.esc_attr($attributes['customFontSize']).'px';
    }  

    if (isset($attributes['fontSize'])){
        $wrapper_class .= ' has-'.esc_attr($attributes['fontSize']).'-font-size';
    } 

    $divider = isset( $attributes['divider']) && $attributes['divider'] != '' ? $attributes['divider'] : '';

    $is_back_end = \defined( 'REST_REQUEST' ) && REST_REQUEST && ! empty( $_REQUEST['context'] ) && 'edit' === $_REQUEST['context'];

    getwid_custom_color_style_and_class($wrapper_style, $wrapper_class, $attributes, 'background', $is_back_end);
    getwid_custom_color_style_and_class($wrapper_style, $wrapper_class, $attributes, 'color', $is_back_end);    

	$tags_list = get_the_tag_list( '', '');
	$result = '';
    
    $extra_attr = array(
        'wrapper_class' => $wrapper_class,
        'wrapper_style' => $wrapper_style,
        'divider' => $divider,
    );

	if ($tags_list) {
		ob_start();
        
            getwid_get_template_part('template-parts/post-tags', $attributes, false, $extra_attr);

		$result = ob_get_clean();
	}
	
	return $result;
}
register_block_type(
    'getwid/template-post-tags',
    array(
        'attributes' => array(
            'blockDivider' => array(
                'type' => 'string',
            ),

            //Colors
            'textColor' => array(
                'type' => 'string',
            ),
            'customTextColor' => array(
                'type' => 'string',
            ),
            'backgroundColor' => array(
                'type' => 'string',
            ),        
            'customBackgroundColor' => array(
                'type' => 'string',
            ),
            //Colors

            'icon' => array(
                'type' => 'string',
                'default' => 'fas fa-tags',
            ),
            'fontSize' => array(
                'type' => 'string',
            ),    
            'customFontSize' => array(
                'type' => 'number',
            ),              
            'divider' => array(
                'type' => 'string',
                'default' => ',',
            ),
            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
            ),
        ),
        'render_callback' => 'render_getwid_template_post_tags',
    )
);