<?php

//extract styles & classes
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <div class="<?php echo esc_attr( $block_name ); ?>__image" style="background-image: url(<?php echo esc_url(get_the_post_thumbnail_url($current_post, $imageSize))?>);"></div>
    <div <?php echo (!empty($foreground_style) ? 'style="'.esc_attr($foreground_style).'"' : '');?> class="<?php echo esc_attr($foreground_class);?>"></div>
    <div <?php echo (!empty($content_container_style) ? 'style="'.esc_attr($content_container_style).'"' : '');?> class="<?php echo esc_attr($content_container_class);?>">
        <?php echo $content; ?>
    </div>
</div>