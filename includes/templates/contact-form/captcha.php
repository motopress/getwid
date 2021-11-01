<?php
    $class = 'wp-block-getwid-captcha';
    if ( isset( $attributes['className'] ) ) {
        $class .= ' ' . $attributes['className'];
    }
?>
<div class='<?php echo esc_attr( $class );?>' data-sitekey='<?php echo esc_attr( $extra_attr['site_key'] ); ?>'<?php
    if ( !isset( $attributes['theme'] ) ) {?>
        data-theme='light'<?php
    } else { ?>
        data-theme='<?php echo esc_attr( $attributes['theme'] ); ?>'<?php
    } ?>
>
</div>
