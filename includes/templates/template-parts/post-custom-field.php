<?php

//extract styles & classes
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php if ( !empty($wrapper_style) ) { ?> style="<?php echo esc_attr($wrapper_style); ?>" <?php } ?>>
    <?php if ( !empty($attributes['customField'] ) ) {
		echo get_post_meta( get_the_ID(), esc_attr( $attributes['customField'] ), true ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    } ?>
</div>
