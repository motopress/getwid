<?php

//extract styles & classes
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php if ( !empty($wrapper_style) ) { ?> style="<?php echo esc_attr($wrapper_style); ?>" <?php } ?>>
    <?php if ( !empty($attributes['customField'] ) ) {
		echo wp_kses_post( get_post_meta( get_the_ID(), esc_attr( $attributes['customField'] ), true ) );
    } ?>
</div>
