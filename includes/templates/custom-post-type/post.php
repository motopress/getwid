<?php
/**
 * Post template in Recent Posts Block
 */

/**
 *
 * @TODO:  Temporary fix wpautop
 *
 */
remove_filter('the_content', 'wpautop');

$base_class = esc_attr($extra_attr['block_name']);

?>

<div id="post-<?php the_ID(); ?>" class="<?php echo $base_class; ?>__post">
    <div class="<?php echo $base_class; ?>__post-wrapper">
        <?php if (has_post_thumbnail()): ?>
            <div class="<?php echo $base_class; ?>__post-thumbnail">
                <a href="<?php the_permalink(); ?>"><?php
                    the_post_thumbnail();
                    ?></a>
            </div>
        <?php endif; ?>
		<div class="<?php echo $base_class; ?>__content-wrapper">
            <div class="<?php echo $base_class; ?>__post-header">
                <?php the_title( '<h3 class="'.$base_class.'__post-title"><a href="'.esc_url(get_permalink()).'">', '</a></h3>' ); ?>
            </div>
			<div class="<?php echo $base_class; ?>__post-excerpt"><?php
				the_excerpt();
			?></div>
		</div>
    </div>
</div>
