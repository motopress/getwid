<?php

//extract styles & classes
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo (!empty($attributes['icon']) ? '<i '.(!empty($attributes['customIconColor']) ? 'style="'.esc_attr($icon_style).'" ' : '' ).'class="'.esc_attr($attributes['icon']).(!empty($icon_class) ? ' '.esc_attr($icon_class) : '').'"></i>' : ''); ?>
		<a href="<?php echo get_day_link( $archive_year, $archive_month, $archive_day); ?>"><?php
			echo esc_html( get_the_date( '' ) );
    	?></a>
	</time>
</div><?php if (isset($attributes['blockDivider']) && $attributes['blockDivider'] != ''){ ?><span class='getwid-post-meta-divider'><?php echo esc_attr($attributes['blockDivider']); ?></span><?php } ?>