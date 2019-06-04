<?php

//UnPack styles & class
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><a href="<?php
        echo get_day_link( $archive_year, $archive_month, $archive_day); ?>"><?php
        echo esc_html( get_the_date( '' ) );
    ?></a></time>
</div>