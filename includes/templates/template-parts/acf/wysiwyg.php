<?php

//extract styles & classes
extract( $extra_attr );

if ( empty( $attributes[ 'customField' ] ) ) {
	return;
}

?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo ( ! empty( $wrapper_style ) ? 'style="' . esc_attr( $wrapper_style ) . '"' : ''); ?>>
    <?php the_field( $attributes[ 'customField' ] ); ?>
</div>
