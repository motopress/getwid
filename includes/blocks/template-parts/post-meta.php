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
    if ( isset( $attributes['textAlignment']) ) {
        $wrapper_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }      

	$result = '';
	$metaContent = [];

	$metaTemplate = array(
		'<!-- wp:getwid/template-post-date /-->',
		'<!-- wp:getwid/template-post-author /-->',
		'<!-- wp:getwid/template-post-categories /-->',
		'<!-- wp:getwid/template-post-tags /-->',
		'<!-- wp:getwid/template-post-comments /-->',
	);

	foreach ($metaTemplate as $template) {
		$block = trim( do_blocks($template) );
		if ( strlen($block) ) {
			$metaContent[] = $block;
		}
	}

    $extra_attr = array(
        'wrapper_class' => $wrapper_class,
        'wrapper_style' => $wrapper_style,
        'metaContent' => $metaContent,
    );

	if ( sizeof($metaTemplate) ) {
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
            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
            ),
        ),
        'render_callback' => 'render_getwid_template_post_meta',
    )
);