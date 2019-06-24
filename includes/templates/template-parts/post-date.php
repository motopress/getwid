<?php

//UnPack styles & class
extract($extra_attr);
?>

<div <?php echo (isset( $attributes['anchor'] ) ? 'id="'.esc_attr($attributes['anchor']).'" ' : '' ); ?>class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo (!empty($attributes['icon']) ? '<i '.(!empty($attributes['iconColor']) ? 'style="color:'.esc_attr($attributes['iconColor']).'" ' : '' ).'class="'.esc_attr($attributes['icon']).(!empty($link_class) ? ' '.esc_attr($link_class) : '').'"></i>' : ''); ?><a href="<?php
        echo get_day_link( $archive_year, $archive_month, $archive_day); ?>"<?php echo (!empty($link_style) ? ' style="'.esc_attr($link_style).'"' : '');?><?php echo (!empty($link_class) ? ' class="'.esc_attr($link_class).'"' : '');?>><?php
        echo esc_html( get_the_date( '' ) );
    ?></a></time>
</div><?php if (isset($attributes['blockDivider']) && $attributes['blockDivider'] != ''){ ?><span class='post-meta__divider'><?php echo esc_attr($attributes['blockDivider']); ?></span><?php } ?>