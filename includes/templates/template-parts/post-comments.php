<?php

//UnPack styles & class
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <a href="<?php echo get_comments_link(); ?>"><?php
        if ( get_comments_number() ) {
            echo sprintf( _n( '%d Comment', '%d Comments', get_comments_number(), 'getwid' ), get_comments_number() );
        } else {
            echo __( 'No comments', 'getwid' );
        }
    ?></a>
</div>