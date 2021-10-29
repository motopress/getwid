<?php

//extract styles & classes
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php if ( !empty($wrapper_style) ) { ?> style="<?php echo esc_attr($wrapper_style); ?>" <?php } ?>>
    <div class="<?php echo esc_attr( $block_name ); ?>__image" style="background-image: url(<?php echo esc_url(get_the_post_thumbnail_url($current_post, $imageSize))?>);"></div>
    <div class="<?php echo esc_attr($foreground_class);?>"
		<?php if ( !empty($foreground_style) ) { ?> style="<?php echo esc_attr($foreground_style);?> " <?php } ?>
	></div>
    <div class="<?php echo esc_attr($content_container_class);?>"
		<?php  if ( !empty($content_container_style) ) { ?> style="<?php echo esc_attr($content_container_style);?>"<?php }?>
	>
        <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
    </div>
</div>
