<?php

//UnPack styles & class
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <?php echo the_title(
        '<'. $headerTag .(!empty($title_style) ? ' style="'.esc_attr($title_style).'"' : '') . (!empty($title_class) ? ' class="'.esc_attr($title_class).'"' : '').'>' .
        ($attributes['linkTo'] == 'post' ? '<a class="'.esc_attr($link_class).'" href="'.esc_url(get_permalink()).'">' : ''), ($attributes['linkTo'] == 'post' ? '</a>' : '').
        '</'. $headerTag .'>'
    ); ?>
</div>