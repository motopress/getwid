<?php

function render_getwid_template_post_categories( $attributes, $content ) {
    //Not BackEnd render if we view from template page
    if ( (get_post_type() == Getwid\PostTemplatePart::$postType) || (get_post_type() == 'revision') ){
        return $content;
    }

    $block_name = 'wp-block-getwid-template-post-categories';
    $wrapper_class = $block_name;

    $wrapper_style = '';
    //Classes
    if ( isset( $attributes['align'] ) ) {
        $wrapper_class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['textAlignment']) ) {
        $wrapper_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }      

	$categories_list = get_the_category_list( esc_html__(', ', 'getwid') );
	$result = '';

    $extra_attr = array(
        'wrapper_class' => $wrapper_class,
        'wrapper_style' => $wrapper_style,
        'categories_list' => $categories_list
    );

	if ( $categories_list ) {
        ob_start();
        
    		getwid_get_template_part('template-parts/post-categories', $attributes, false, $extra_attr);

		$result = ob_get_clean();
	}

    return $result;
}
register_block_type(
    'getwid/template-post-categories',
    array(
        'attributes' => array(
            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
            ),
        ),
        'render_callback' => 'render_getwid_template_post_categories',
    )
);