<?php 
    $class = 'wp-block-getwid-captcha';
    if ( isset( $attributes['className'] ) ) {
        $class .= ' '.esc_attr($attributes['className']);
    }      
?>
<div class='<?php echo esc_attr( $class );?>' data-sitekey='<?php echo $extra_attr['site_key']; ?>'<?php
    if ( !isset( $attributes['theme'] ) ) {?>
        data-theme='<?php echo 'light' ?>'<?php
    } else { ?>
        data-theme='<?php echo $attributes['theme']; ?>'<?php
    } ?>
>
</div>