<?php

//UnPack styles & class
extract($extra_attr);
?>

<div <?php echo (isset( $attributes['anchor'] ) ? 'id="'.esc_attr($attributes['anchor']).'" ' : '' ); ?>class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <a href="<?php echo esc_url(get_permalink()); ?>" <?php echo (!empty($link_style) ? 'style="'.esc_attr($link_style).'"' : '');?> <?php echo (!empty($link_class) ? 'class="'.esc_attr($link_class).'"' : '');?>><?php echo $attributes['buttonText']; ?></a>
</div>