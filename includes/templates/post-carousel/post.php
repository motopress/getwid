<?php
/**
 * The template for displaying all single posts in Post Carousel block
 */

$base_class = esc_attr($extra_attr['block_name']);

?>

<div class="<?php echo $base_class; ?>__post">
    <?php if (has_post_thumbnail()): ?>
        <div class="<?php echo $base_class; ?>__post-thumbnail">
            <a href="<?php echo esc_url(get_permalink()); ?>"><?php
                the_post_thumbnail();
                ?></a>
        </div>
    <?php endif; ?>
    <div class="<?php echo $base_class; ?>__post-content-wrapper">
        <div class="<?php echo $base_class; ?>__post-header">
            <?php the_title( '<h3 class="'.$base_class.'__post-title"><a href="'.esc_url(get_permalink()).'">', '</a></h3>' ); ?>
        </div>
        <div class="<?php echo $base_class; ?>__post-excerpt"><?php
            the_excerpt();
        ?></div>
    </div>
</div>

