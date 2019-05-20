<?php
/**
 * The template for displaying all single posts and attachments
 */
$imageSize = ( ( isset($attributes['imageSize']) && $attributes['imageSize'] ) ? $attributes['imageSize'] : 'post-thumbnail');
$showTitle = isset( $attributes['showTitle'] ) && $attributes['showTitle'];
$contentLength = isset( $attributes['contentLength'] ) ? $attributes['contentLength'] : false;

//UnPack styles & class
extract($extra_attr['styles']);

/**
 *
 * @TODO:  Temporary fix wpautop
 *
 */
remove_filter('the_content', 'wpautop');
?>

<article <?php echo (!empty($slide_style) ? 'style="'.esc_attr($slide_style).'"' : '');?> id="post-<?php the_ID(); ?>" class="<?php echo esc_attr($extra_attr['block_name'].'__slide');?>">
    <div <?php echo (!empty($slide_container_style) ? 'style="'.esc_attr($slide_container_style).'"' : '');?> class="<?php echo esc_attr($slide_container_class);?>">
        <div <?php echo (!empty($slide_wrapper_style) ? 'style="'.esc_attr($slide_wrapper_style).'"' : '');?> class="<?php echo esc_attr($extra_attr['block_name'].'__slide-wrapper');?>">        
            <figure class="<?php echo esc_attr($extra_attr['block_name'].'__slide-media');?>">
                <a href="<?php echo esc_url(get_permalink()); ?>"><?php the_post_thumbnail( $imageSize, array('alt' => the_title_attribute( 'echo=0' )));?></a>
                <div <?php echo (!empty($slide_media_style) ? 'style="'.esc_attr($slide_media_style).'"' : '');?> <?php echo (!empty($slide_media_class) ? 'class="'.esc_attr($slide_media_class).'"' : '');?>></div>    
            </figure>
            <div <?php echo (!empty($slide_content_style) ? 'style="'.esc_attr($slide_content_style).'"' : '');?> <?php echo (!empty($slide_content_class) ? 'class="'.esc_attr($slide_content_class).'"' : '');?>>
                <div class="<?php echo esc_attr($extra_attr['block_name'].'__slide-content-wrapper');?>">
                    <?php if ( $showTitle ) { ?>
                        <?php the_title( '<'.esc_attr($attributes['titleTag']).'><a href="'.esc_url(get_permalink()).'">', '</a></'.esc_attr($attributes['titleTag']).'>' ); ?>
                    <?php } ?>

                    <?php if ( $attributes['showContent'] == 'excerpt' ) { ?>
                        <div><?php
							echo esc_html( wp_trim_words( get_the_excerpt(), $contentLength ) );
						?></div>
                    <?php } elseif ($attributes['showContent'] == 'content'){ ?>
                        <div><?php
							the_content( sprintf(
								wp_kses(
									/* translators: %s: Name of current post. Only visible to screen readers */
									__( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'getwid' ),
									array(
										'span' => array(
											'class' => array(),
										),
									)
								),
								get_the_title()
							) );
						?></div>
                    <?php } ?>
                </div> 
            </div> 
        </div>
    </div>
</article>