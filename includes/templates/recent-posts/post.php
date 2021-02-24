<?php
/**
 * Post template in Recent Posts Block
 */
$archive_year  = get_the_time('Y');
$archive_month = get_the_time('m');
$archive_day   = get_the_time('d');

$imageSize = ( ( isset($attributes['imageSize']) && $attributes['imageSize'] ) ? $attributes['imageSize'] : 'post-thumbnail');

$showTitle = isset( $attributes['showTitle'] ) && $attributes['showTitle'];
$showFeaturedImage = isset( $attributes['showFeaturedImage'] ) && $attributes['showFeaturedImage'] && has_post_thumbnail();
$showCategories = isset( $attributes['showCategories'] ) && $attributes['showCategories'] && has_category();
$showCommentsCount = isset( $attributes['showCommentsCount'] ) && $attributes['showCommentsCount'] && comments_open();
$showContent = isset( $attributes['showContent'] ) ? $attributes['showContent'] : false;
$showDate = isset( $attributes['showDate'] ) && $attributes['showDate'];
$contentLength = isset( $attributes['contentLength'] ) ? $attributes['contentLength'] : false;

/**
 *
 * @TODO:  Temporary fix wpautop
 *
 */
remove_filter('the_content', 'wpautop');

?>

<article id="post-<?php the_ID(); ?>" class="<?php echo esc_attr($extra_attr['block_name'].'__post');?>">
    <div class="<?php echo esc_attr($extra_attr['block_name'].'__post-wrapper');?>">
        <?php if ( $showFeaturedImage ) { ?>
            <div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-thumbnail">
                <a href="<?php echo esc_url(get_permalink()); ?>"><?php
                    the_post_thumbnail( $imageSize, array('alt' => the_title_attribute( 'echo=0' )));
                    ?></a>
            </div>
        <?php } ?>
        <?php
        if($showTitle || $showDate || $showContent || $showCategories || $showCommentsCount):
        ?>
            <div class="<?php echo esc_attr($extra_attr['block_name'])?>__content-wrapper">
                <?php
                if($showTitle || $showDate):
                ?>
                    <header class="<?php echo esc_attr($extra_attr['block_name'])?>__entry-header">
                        <?php if ( $showTitle ) { ?>
                            <?php the_title( '<'.esc_attr($attributes['titleTag']).' class="'.esc_attr($extra_attr['block_name']).'__post-title"><a href="'.esc_url(get_permalink()).'">', '</a></'.esc_attr($attributes['titleTag']).'>' ); ?>
                        <?php } ?>
                        <?php
                        if($showDate):
                        ?>
                            <div class="<?php echo esc_attr($extra_attr['block_name'])?>__entry-meta">
                                <?php if ( $showDate ) { ?>
                                    <span class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-date">
                                        <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><a href="<?php
                                            echo get_day_link( $archive_year, $archive_month, $archive_day); ?>"><?php
                                            echo esc_html( get_the_date( '' ) );
                                        ?></a></time>
                                    </span>
                                <?php } ?>
                            </div>
                        <?php
                        endif;
                        ?>
                    </header>
                <?php
                endif;
                ?>
                <?php if ( $showContent ) {
				?><div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-content"><?php

					echo esc_html( wp_trim_words( get_the_excerpt(), $contentLength ) );

				?></div>
                <?php } ?>

                <?php
                if ( $showCategories || $showCommentsCount ) :
                ?>
                    <footer class="<?php echo esc_attr($extra_attr['block_name'])?>__entry-footer">
                        <?php if ( $showCategories ) { ?>
                            <p class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-categories">
                                <?php echo get_the_category_list(', '); ?>
                            </p>
                        <?php } ?>
                        <?php if ( $showCommentsCount ) { ?>
                            <p class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-comments">
                                <a href="<?php echo get_comments_link(); ?>"><?php
								if ( get_comments_number() ) {
									//translators: %d is a comments count
									echo sprintf( _n( '%d Comment', '%d Comments', get_comments_number(), 'getwid' ), get_comments_number() );
								} else {
									echo __( 'No comments', 'getwid' );
								}
                                ?></a>
                            </p>
                        <?php } ?>
                    </footer>
                <?php
                endif;
                ?>
            </div>
        <?php
        endif;
        ?>
    </div>
</article>
