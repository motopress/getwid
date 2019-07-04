<?php
/**
 * The template for displaying all single posts and attachments
 */

//UnPack styles & class
extract($extra_attr['styles']);

/**
 *
 * @TODO:  Temporary fix wpautop
 *
 */
remove_filter('the_content', 'wpautop');
?>

<div <?php echo (!empty($slide_style) ? 'style="'.esc_attr($slide_style).'"' : '');?> id="post-<?php the_ID(); ?>" class="<?php echo esc_attr($extra_attr['block_name'].'__slide post-type-'.get_post_type());?>">
    <div <?php echo (!empty($slide_container_style) ? 'style="'.esc_attr($slide_container_style).'"' : '');?> class="<?php echo esc_attr($slide_container_class);?>">
        <div <?php echo (!empty($slide_wrapper_style) ? 'style="'.esc_attr($slide_wrapper_style).'"' : '');?> class="<?php echo esc_attr($extra_attr['block_name'].'__slide-content');?>">
            <?php if (has_post_thumbnail()){?>
                <div class="<?php echo esc_attr($extra_attr['block_name'].'__slide-post-thumbnail');?>">
                    <?php the_post_thumbnail();?>
                    <div <?php echo (!empty($slide_media_style) ? 'style="'.esc_attr($slide_media_style).'"' : '');?> <?php echo (!empty($slide_media_class) ? 'class="'.esc_attr($slide_media_class).'"' : '');?>></div>    
                </div>
            <?php } ?>    
            <div <?php echo (!empty($slide_content_style) ? 'style="'.esc_attr($slide_content_style).'"' : '');?> <?php echo (!empty($slide_content_class) ? 'class="'.esc_attr($slide_content_class).'"' : '');?>>
				<?php the_title( '<h3 class="'.$extra_attr['block_name'].'__slide-post-title"><a href="'.esc_url(get_permalink()).'">', '</a></h3>' ); ?>
				<div class="<?php echo esc_attr($extra_attr['block_name'].'__slide-post-excerpt');?>"><p><?php
					echo esc_html( get_the_excerpt() );
				?></p></div>
            </div> 
        </div>
    </div>
</div>