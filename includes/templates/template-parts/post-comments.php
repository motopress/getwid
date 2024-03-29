<?php

//extract styles & classes
extract($extra_attr);

$icon_classes = array(
	$attributes['icon'],
	!empty($icon_class) ? $icon_class : ''
);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php if ( !empty($wrapper_style) ) { ?>style="<?php echo esc_attr($wrapper_style); ?>"<?php } ?>>
    <?php if ( !empty($attributes['icon']) ) {
		?>
		<i class="<?php echo esc_attr( implode(' ', $icon_classes) );?>"
		<?php if ( ! empty( $attributes['customIconColor'] ) ) { ?>
			style="<?php echo esc_attr($icon_style); ?>"
		<?php } ?>
		></i>
		<?php
    } ?>
	<a href="<?php echo esc_url( get_comments_link() ); ?>"><?php
        if ( get_comments_number() ) {
            //translators: %d is a comments count
			echo esc_html( sprintf( _n( '%d Comment', '%d Comments', get_comments_number(), 'getwid' ), get_comments_number() ) );
        } else {
            echo esc_html__( 'No comments', 'getwid' );
        }
    ?></a>
</div><?php if (isset($attributes['blockDivider']) && $attributes['blockDivider'] != ''){ ?><span class='getwid-post-meta-divider'><?php echo esc_attr($attributes['blockDivider']); ?></span><?php } ?>
