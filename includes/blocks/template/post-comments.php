<?php

function render_getwid_template_post_comments( $attributes ) {
    //Not BackEnd render if we view from template page
    if (get_post_type() == 'getwid_template_part'){
        return;
    }

    $block_name = 'wp-block-getwid-template-post-comments';
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
	if ( comments_open() || get_comments_number() ) {
		ob_start();
		?>
			<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
				<a href="<?php echo get_comments_link(); ?>"><?php
					if ( get_comments_number() ) {
						echo sprintf( _n( '%d Comment', '%d Comments', get_comments_number(), 'getwid' ), get_comments_number() );
					} else {
						echo __( 'No comments', 'getwid' );
					}
				?></a>
			</div>
		<?php

		$result = ob_get_clean();
	}

    return $result;
}
register_block_type(
    'getwid/template-post-comments',
    array(
        'attributes' => array(
            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
            ),
        ),
        'render_callback' => 'render_getwid_template_post_comments',
    )
);