<?php

//extract styles & classes
extract( $extra_attr );

if ( empty( $attributes[ 'customField' ] ) ) {
	return;
}

?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php if ( ! empty( $wrapper_style ) ) { ?> style="<?php echo esc_attr( $wrapper_style );?>"<?php } ?>>
    <?php the_field( $attributes[ 'customField' ] ); ?>
</div>
