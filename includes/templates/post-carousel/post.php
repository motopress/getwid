<?php
/**
 * The template for displaying all single posts and attachments
 */

/**
 *
 * @TODO:  Temporary fix wpautop
 *
 */
remove_filter('the_content', 'wpautop');

?>

<div id="post-<?php the_ID(); ?>" class="<?php echo esc_attr($extra_attr['block_name'].'__slide');?>">
    <div class="<?php echo esc_attr($extra_attr['block_name'].'__post');?>">
        <?php if (has_post_thumbnail()){?>
            <div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-thumbnail">
                <a href="<?php echo esc_url(get_permalink()); ?>"><?php
                    the_post_thumbnail();
                    ?></a>
            </div>
        <?php } ?>         
        <div class="<?php echo esc_attr($extra_attr['block_name'])?>__post-content-wrapper">
            <div class="<?php echo esc_attr($extra_attr['block_name'])?>__post-header">                        
                <?php the_title( '<h3 class="'.esc_attr($extra_attr['block_name']).'__post-title"><a href="'.esc_url(get_permalink()).'">', '</a></h3>' ); ?>                        
            </div>          
            <div class="<?php echo esc_attr($extra_attr['block_name'])?>__post-excerpt"><p><?php
                echo esc_html( get_the_excerpt() );
            ?></p></div>
        </div>
    </div>
</div>
