<?php

//extract styles & classes
extract($extra_attr);

$icon_classes = array(
		$attributes['icon'],
		!empty($icon_class) ? $icon_class : ''
);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php if ( !empty($wrapper_style) ) { ?> style="<?php echo esc_attr($wrapper_style); ?>"<?php } ?>>
	<i class="<?php echo esc_attr( implode(' ', $icon_classes) );?>"
			<?php if ( ! empty( $attributes['customIconColor'] ) ) { ?>
				style="<?php echo esc_attr($icon_style); ?>"
			<?php } ?>
	></i>
	<?php echo get_the_tag_list('', $divider.' ',''); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div><?php if (isset($attributes['blockDivider']) && $attributes['blockDivider'] != ''){ ?><span class='getwid-post-meta-divider'><?php echo esc_attr($attributes['blockDivider']); ?></span><?php } ?>
