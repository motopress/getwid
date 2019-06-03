<?php

//UnPack styles & class
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <div class="background_image_wrapper" style="background-image: url(<?php echo esc_url(get_the_post_thumbnail_url($current_post, $imageSize))?>);"></div>
    <div <?php echo (!empty($content_container_style) ? 'style="'.esc_attr($content_container_style).'"' : '');?> class="<?php echo esc_attr($content_container_class);?>">
        <?php echo $content; ?>
    </div>
</div>