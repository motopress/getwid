<?php

//UnPack styles & class
extract($extra_attr);
?>

<?php echo the_title(
    '<'. esc_attr($headerTag) .(isset( $attributes['anchor'] ) ? ' id="'.esc_attr($attributes['anchor']).'" ' : '' ).(!empty($title_style) ? ' style="'.esc_attr($title_style).'"' : '') . (!empty($title_class) ? ' class="'.esc_attr($title_class).'"' : '').'>' .
    ($attributes['linkTo'] == 'post' ? '<a class="'.esc_attr($link_class).'" href="'.esc_url(get_permalink()).'">' : ''), ($attributes['linkTo'] == 'post' ? '</a>' : '').
    '</'. esc_attr($headerTag) .'>'
); ?>