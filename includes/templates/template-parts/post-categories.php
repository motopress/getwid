<?php

//UnPack styles & class
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <?php echo (!empty($attributes['icon']) ? '<i '.(!empty($attributes['iconColor']) ? 'style="color:'.esc_attr($attributes['iconColor']).'" ' : '' ).'class="'.esc_attr($attributes['icon']).(!empty($link_class) ? ' '.esc_attr($link_class) : '').'"></i> ' : ''); ?><?php echo $categories_list ?>
</div><?php if (isset($attributes['blockDivider']) && $attributes['blockDivider'] != ''){ ?><span class='post-meta__divider'><?php echo esc_attr($attributes['blockDivider']); ?></span><?php } ?>