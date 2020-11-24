<?php

//extract styles & classes
extract($extra_attr);
?>
<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <?php echo (!empty($attributes['icon']) ? '<i '.(!empty($attributes['customIconColor']) ? 'style="'.esc_attr($icon_style).'" ' : '' ).'class="'.esc_attr($attributes['icon']).(!empty($icon_class) ? ' '.esc_attr($icon_class) : '').'"></i>' : ''); ?>
    <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>"<?php echo (!empty($link_style) ? ' style="'.esc_attr($link_style).'"' : '');?><?php echo (!empty($link_class) ? ' class="'.esc_attr($link_class).'"' : '');?>><?php echo esc_html( get_the_author() ); ?></a>
</div><?php if (isset($attributes['blockDivider']) && $attributes['blockDivider'] != ''){ ?><span class='getwid-post-meta-divider'><?php echo esc_attr($attributes['blockDivider']); ?></span><?php }
