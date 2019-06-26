<?php

//UnPack styles & class
extract($extra_attr);
?>

<div <?php echo (isset( $attributes['anchor'] ) ? 'id="'.esc_attr($attributes['anchor']).'" ' : '' ); ?>class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <?php echo (!empty($attributes['icon']) ? '<i '.(!empty($attributes['customIconColor']) ? 'style="'.esc_attr($icon_style).'" ' : '' ).'class="'.esc_attr($attributes['icon']).(!empty($icon_class) ? ' '.esc_attr($icon_class) : '').'"></i>' : ''); ?><?php echo get_the_tag_list('', $divider.' ',''); ?>
</div><?php if (isset($attributes['blockDivider']) && $attributes['blockDivider'] != ''){ ?><span class='post-meta__divider'><?php echo esc_attr($attributes['blockDivider']); ?></span><?php } ?>



