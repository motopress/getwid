<?php

//UnPack styles & class
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
    <?php echo (!empty($attributes['icon']) ? '<i '.(!empty($attributes['iconColor']) ? 'style="color:'.esc_attr($attributes['iconColor']).'" ' : '' ).'class="'.esc_attr($attributes['icon']).(!empty($link_class) ? ' '.esc_attr($link_class) : '').'"></i> ' : ''); ?><a href="<?php echo get_comments_link(); ?>"<?php echo (!empty($link_style) ? ' style="'.esc_attr($link_style).'"' : '');?><?php echo (!empty($link_class) ? ' class="'.esc_attr($link_class).'"' : '');?>><?php
        if ( get_comments_number() ) {
            echo sprintf( _n( '%d Comment', '%d Comments', get_comments_number(), 'getwid' ), get_comments_number() );
        } else {
            echo __( 'No comments', 'getwid' );
        }
    ?></a>
</div><?php if (isset($attributes['blockDivider']) && $attributes['blockDivider'] != ''){ ?><span class='post-meta__divider'><?php echo esc_attr($attributes['blockDivider']); ?></span><?php } ?>