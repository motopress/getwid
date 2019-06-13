<?php

function render_getwid_template_post_custom_fields( $attributes, $content ) {

    //Not BackEnd render if we view from template page
    if ( (get_post_type() == Getwid\PostTemplatePart::$postType) || (get_post_type() == 'revision') ){
        return $content;
    }

    $block_name = 'wp-block-getwid-template-post-custom-fields';
    $wrapper_class = $block_name;

    if ( isset( $attributes['className'] ) ) {
        $wrapper_class .= ' '.esc_attr($attributes['className']);
    }

    $wrapper_style = '';
    //Classes
    if ( isset( $attributes['align'] ) ) {
        $wrapper_class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['textAlignment']) ) {
        $wrapper_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }      
    if ( isset( $attributes['bold']) &&  $attributes['bold'] ) {
        $wrapper_style .= 'font-weight: bold;';
    }
    if ( isset( $attributes['italic']) && $attributes['italic'] ) {
        $wrapper_style .= 'font-style: italic;';
    }

    $is_back_end = \defined( 'REST_REQUEST' ) && REST_REQUEST && ! empty( $_REQUEST['context'] ) && 'edit' === $_REQUEST['context'];

    //Link style & class
    $title_style = '';
    $title_class = '';
    $link_class = esc_attr($block_name).'__link';

    if ( isset( $attributes['customFontSize']) ) {
        $title_style .= 'font-size: '.esc_attr($attributes['customFontSize']).'px';
    }  

    if (isset($attributes['fontSize'])){
        $title_class .= ' has-'.esc_attr($attributes['fontSize']).'-font-size';
    }    

    getwid_custom_color_style_and_class($title_style, $title_class, $attributes, 'color', $is_back_end); 

	$result = '';
    
    $extra_attr = array(
        'wrapper_class' => $wrapper_class,
        'wrapper_style' => $wrapper_style,
        'title_style' => $title_style,
        'title_class' => $title_class,
        'link_class' => $link_class,
    );

	if ( isset( $attributes['customField']) ) {
		ob_start();
        
            getwid_get_template_part('template-parts/post-custom-fields', $attributes, false, $extra_attr);

		$result = ob_get_clean();
	}

    return $result;
}
register_block_type(
    'getwid/template-post-custom-fields',
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
            
            'fontSize' => array(
                'type' => 'string',
            ),    
            'customFontSize' => array(
                'type' => 'number',
            ),  
            'customField' => array(
                'type' => 'string',
            ),            
            'bold' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'italic' => array(
                'type' => 'boolean',
                'default' => false,
            ),             
            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
            ),
        ),
        'render_callback' => 'render_getwid_template_post_custom_fields',
    )
);