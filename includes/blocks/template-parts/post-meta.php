<?php

function render_getwid_template_post_meta( $attributes, $content ) {
    //Not BackEnd render if we view from template page
    if ( (get_post_type() == Getwid\PostTemplatePart::$postType) || (get_post_type() == 'revision') ){
        return $content;
    }

    $block_name = 'wp-block-getwid-template-post-meta';
    $wrapper_class = $block_name;

    $wrapper_style = '';
    //Classes
    if ( isset( $attributes['align'] ) ) {
        $wrapper_class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['direction'] ) ) {
        $wrapper_class .= ' has-direction-' . esc_attr($attributes['direction']);
    }    
    if ( isset( $attributes['textAlignment']) ) {
        $wrapper_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }      

	$result = '';

    $extra_attr = array(
        'wrapper_class' => $wrapper_class,
        'wrapper_style' => $wrapper_style,
        'content' => $content,
    );

	if ( strlen( $content ) ) {
		ob_start();
        
            getwid_get_template_part('template-parts/post-meta', $attributes, false, $extra_attr);

		$result = ob_get_clean();
	}

    return $result;
}
register_block_type(
    'getwid/template-post-meta',
    array(
        'attributes' => array(
            'alignment' => array( //!
                'type' => 'string',
            ),

            'align' => array(
                'type' => 'string',
            ),
            'direction' => array(
                'type' => 'string',
                'default' => 'row',
            ),            
            'textAlignment' => array(
                'type' => 'string',
            ),
        ),
        'render_callback' => 'render_getwid_template_post_meta',
    )
);