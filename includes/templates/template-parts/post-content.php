<?php

//extract styles & classes
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>><?php
	if ( $attributes['showContent'] == 'excerpt' || has_getwid_nested_blocks() ) {
        ?><p><?php echo esc_html( wp_trim_words( get_the_excerpt(), $contentLength ) ); ?></p><?php
    } elseif ( $attributes['showContent'] == 'content' ) {
		the_content();
	} elseif ( $attributes['showContent'] == 'full' ) {
        echo do_blocks( wp_kses_post( html_entity_decode( $current_post->post_content, ENT_QUOTES, get_option( 'blog_charset' ) ) ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    } ?>
</div>
