<?php

//extract styles & classes
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php if ( !empty($wrapper_style) ) { ?> style="<?php echo esc_attr($wrapper_style); ?>" <?php } ?>>
    <a href="<?php echo esc_url( get_permalink() ); ?>" <?php if ( !empty($link_style) ) { ?> style="<?php echo esc_attr($link_style); ?>" <?php } if ( !empty($link_class) ) { ?> class="<?php echo esc_attr($link_class); ?>" <?php } ?>>
		<?php echo wp_kses_post( $attributes['buttonText'] ); ?>
	</a>
</div>
