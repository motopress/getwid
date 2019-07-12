<?php

//extract styles & classes
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <?php echo (!empty($attributes['customField']) ? get_post_meta(get_the_ID(), esc_attr($attributes['customField']), true) : ''); ?>
</div>