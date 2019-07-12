<?php

//extract styles & classes
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <a href="<?php echo esc_url(get_permalink()); ?>"><?php echo $attributes['buttonText']; ?></a>
</div>