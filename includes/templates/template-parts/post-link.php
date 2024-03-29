<?php

//extract styles & classes
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php if ( !empty($wrapper_style) ) { ?> style="<?php echo esc_attr($wrapper_style); ?>" <?php } ?>>
    <a href="<?php echo esc_url( get_permalink() ); ?>"><?php echo wp_kses_post( $attributes['buttonText'] ); ?></a>
</div>
