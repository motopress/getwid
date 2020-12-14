<?php
/**
 * The template for displaying all single posts in Post Slider block
 */

$base_class = esc_attr($extra_attr['block_name']);

?>

<div class="<?php echo $base_class; ?>__post">
    <?php if (has_post_thumbnail()): ?>
        <div class="<?php echo $base_class; ?>__post-thumbnail">
            <?php the_post_thumbnail();?>
        </div>
    <?php endif; ?>
    <div class="<?php echo $base_class; ?>__post-overlay"></div>
    <div class="<?php echo $base_class; ?>__post-content-wrapper">
        <?php the_title( '<h3 class="'.$base_class.'__post-title"><a href="'.esc_url(get_permalink()).'">', '</a></h3>' ); ?>
        <div class="<?php echo $base_class; ?>__post-excerpt"><?php
            the_excerpt();
        ?></div>
    </div>
</div>