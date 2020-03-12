<?php

//extract styles & classes
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>><?php

	// prevent recursion
	$exclude_blocks = [ 'getwid/custom-post-type', 'getwid/post-carousel', 'getwid/post-slider' ];
	$has_exclude_block = false;
	foreach( $exclude_blocks as $block ) {
		if ( has_block($block) ) {
			$has_exclude_block = true;
			break;
		}
	}

	if ( $attributes['showContent'] == 'excerpt' || $has_exclude_block ) {
        echo '<p>'.esc_html( wp_trim_words( get_the_excerpt(), $contentLength ) ).'</p>';
    } elseif ($attributes['showContent'] == 'content'){
		the_content();
	} elseif ($attributes['showContent'] == 'full'){
        echo do_blocks( wp_kses_post( html_entity_decode( $current_post->post_content, ENT_QUOTES, get_option( 'blog_charset' ) ) ) );
    } ?>
</div>
