<?php
/**
 * The template for displaying all single posts and attachments
 */
$archive_year  = get_the_time('Y');
$archive_month = get_the_time('m');
$archive_day   = get_the_time('d');

$imageSize = ( ( isset($attributes['imageSize']) && $attributes['imageSize'] ) ? $attributes['imageSize'] : 'post-thumbnail');

$showTitle = isset( $attributes['showTitle'] ) && $attributes['showTitle'];
$showFeaturedImage = isset( $attributes['showFeaturedImage'] ) && $attributes['showFeaturedImage'] && has_post_thumbnail();
$showCategories = isset( $attributes['showCategories'] ) && $attributes['showCategories'] && has_category();
$showTags = isset( $attributes['showTags'] ) && $attributes['showTags'] && has_tag();
$showAuthor = isset( $attributes['showAuthor'] ) && $attributes['showAuthor'];
$showCommentsCount = isset( $attributes['showCommentsCount'] ) && $attributes['showCommentsCount'] && comments_open();
$showContent = isset( $attributes['showContent'] ) && $attributes['showContent'] != 'none';
$showDate = isset( $attributes['showDate'] ) && $attributes['showDate'];
?>

<article id="post-<?php the_ID(); ?>" <?php post_class($extra_attr['block_name'].'__post'); ?>>
    <?php if ( $showFeaturedImage ) { ?>
        <div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-thumbnail post-thumbnail">
            <a href="<?php echo esc_url(get_permalink()); ?>"><?php
                the_post_thumbnail( $imageSize, array('alt' => the_title_attribute( 'echo=0' )));
                ?></a>
        </div>
    <?php } ?>
    <?php
    if($showTitle || $showDate || $showAuthor || $showContent || $showCategories || $showTags || $showCommentsCount):
    ?>
        <div class="<?php echo esc_attr($extra_attr['block_name'])?>__content-wrapper">
            <?php
            if($showTitle || $showDate || $showAuthor):
            ?>
                <header class="<?php echo esc_attr($extra_attr['block_name'])?>__entry-header entry-header">
                    <?php if ( $showTitle ) { ?>
                        <?php the_title( '<'.esc_attr($attributes['titleTag']).' class="'.esc_attr($extra_attr['block_name']).'__post-title"><a href="'.esc_url(get_permalink()).'">', '</a></'.esc_attr($attributes['titleTag']).'>' ); ?>
                    <?php } ?>

                    <?php
                    if($showDate || $showAuthor):
                    ?>
                        <div class="<?php echo esc_attr($extra_attr['block_name'])?>__entry-meta entry-meta">
                            <?php if ( $showDate ) { ?>
                                <span class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-date posted-on">
                                    <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><a href="<?php
                                        echo get_day_link( $archive_year, $archive_month, $archive_day); ?>"><?php
                                        echo esc_html( get_the_date( '' ) );
                                    ?></a></time>
                                </span>
                            <?php } ?>
                            <?php if ( $showAuthor ) { ?>
                                <span class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-author byline">
                                    <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>"><?php echo get_the_author(); ?></a>
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
            <?php if ( $showContent ) { ?>
                <div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-content entry-content"><?php
                    if ($attributes['showContent'] == 'excerpt') {
                        the_excerpt();
                    } elseif ($attributes['showContent'] == 'content') {
                        the_content();
                    }
                ?></div>
            <?php } ?>

            <?php
            if ( $showCategories || $showTags || $showCommentsCount ) :
            ?>
                <footer class="<?php echo esc_attr($extra_attr['block_name'])?>__entry-footer entry-footer">
                    <?php if ( $showCategories ) { ?>
                        <span class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-categories cat-links">
                            <?php echo get_the_category_list(', '); ?>
                        </span>
                    <?php } ?>
                    <?php if ( $showTags ) { ?>
                        <span class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-tags tags-links">
                            <?php echo get_the_tag_list('', ', ', ''); ?>
                        </span>
                    <?php } ?>
                    <?php if ( $showCommentsCount ) { ?>
                        <span class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-comments comment-count">
                            <a href="<?php echo get_comments_link(); ?>"><?php
                                    if ( get_comments_number() ) {
                                        echo sprintf( _n( '%d Comment', '%d Comments', get_comments_number(), 'getwid' ), get_comments_number() );
                                    } else {
                                        echo __( 'No comments', 'getwid' );
                                    }
                            ?></a>
                        </span>
                    <?php } ?>
                </footer>
            <?php
            endif;
            ?>
        </div>
    <?php
    endif;
    ?>
</article>