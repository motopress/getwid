<?php

function render_getwid_template_post_author( $attributes, $content ) {
    //Not BackEnd render if we view from template page
    if ( (get_post_type() == Getwid\PostTemplatePart::$postType) || (get_post_type() == 'revision') ){
        return $content;
    }
        
    $block_name = 'wp-block-getwid-template-post-author';
    $wrapper_class = $block_name;

    $wrapper_style = '';
    //Classes
    if ( isset( $attributes['align'] ) ) {
        $wrapper_class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['textAlignment']) ) {
        $wrapper_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }      

	$result = '';

    $extra_attr = array(
        'wrapper_class' => $wrapper_class,
        'wrapper_style' => $wrapper_style,
    );

	if ( get_the_author() ) {
        ob_start();

            getwid_get_template_part('template-parts/post-author', $attributes, false, $extra_attr);
            
		$result = ob_get_clean();
	}

	return $result;
}
register_block_type(
    'getwid/template-post-author',
    array(
        'attributes' => array(
            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
            ),
        ),
        'render_callback' => 'render_getwid_template_post_author',
    )
);