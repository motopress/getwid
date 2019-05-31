<?php

function render_getwid_template_post_date( $attributes ) {
    $block_name = 'wp-block-getwid-template-post-date';
    $wrapper_class = $block_name;

    $wrapper_style = '';
    //Classes
    if ( isset( $attributes['align'] ) ) {
        $wrapper_class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['textAlignment']) ) {
        $wrapper_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }      

    $archive_year  = get_the_time('Y');
    $archive_month = get_the_time('m');
    $archive_day   = get_the_time('d');

	$result = '';

	if ( get_the_date() ) {
		ob_start();
		?>
			<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
				<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><a href="<?php
					echo get_day_link( $archive_year, $archive_month, $archive_day); ?>"><?php
					echo esc_html( get_the_date( '' ) );
				?></a></time>
			</div>
		<?php

		$result = ob_get_clean();
	}

    return $result;
}
register_block_type(
    'getwid/template-post-date',
    array(
        'attributes' => array(
            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
            ),
        ),
        'render_callback' => 'render_getwid_template_post_date',
    )
);