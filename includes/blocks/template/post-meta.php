<?php

function render_getwid_template_post_meta( $attributes ) {
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

	if ( sizeof($metaTemplate) ) {
		ob_start();
		?>
		<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
			<?php echo implode('<span>  &#183;  </span>', $metaContent); ?>
		</div>
		<?php

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