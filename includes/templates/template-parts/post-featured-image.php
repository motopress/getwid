<?php

//extract styles & classes
extract($extra_attr);
?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php if ( !empty($wrapper_style) ) { ?> style="<?php echo esc_attr($wrapper_style); ?>" <?php } ?>>
    <?php if ($attributes['linkTo'] == 'post'){ ?>
        <a href="<?php echo esc_url(get_permalink()); ?>">
    <?php } ?>
    <?php the_post_thumbnail( $imageSize, array('alt' => the_title_attribute( 'echo=0' ))); ?>
    <?php if ($attributes['linkTo'] == 'post'){ ?>
        </a>
    <?php } ?>
</div>
