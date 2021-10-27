<?php

//extract styles & classes
extract($extra_attr);

$icon_classes = array(
		$attributes['icon'],
		!empty($icon_class) ? $icon_class : ''
);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php if ( !empty($wrapper_style) ) { ?> style="<?php echo esc_attr($wrapper_style); ?>" <?php } ?>>
    <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php
		if ( !empty($attributes['icon']) ) { ?>
			<i class="<?php echo esc_attr( implode(' ', $icon_classes) );?>"
			<?php if ( ! empty( $attributes['customIconColor'] ) ) { ?>
				style="<?php echo esc_attr($icon_style); ?>"
			<?php } ?>
			></i>
		<?php } ?>
		<a href="<?php echo esc_url( get_day_link( $archive_year, $archive_month, $archive_day) ); ?>"><?php
			echo esc_html( get_the_date( '' ) );
    	?></a>
	</time>
</div><?php if (isset($attributes['blockDivider']) && $attributes['blockDivider'] != ''){ ?><span class='getwid-post-meta-divider'><?php echo esc_attr($attributes['blockDivider']); ?></span><?php } ?>
