<?php
/**
 * Post template in Recent Posts Block
 */
$archive_year  = get_the_time('Y');
$archive_month = get_the_time('m');
$archive_day   = get_the_time('d');


/**
 *
 * @TODO:  Temporary fix wpautop
 *
 */
remove_filter('the_content', 'wpautop');

?>

<div id="post-<?php the_ID(); ?>" class="<?php echo esc_attr($extra_attr['block_name'].'__post');?>">
    <div class="<?php echo esc_attr($extra_attr['block_name'].'__post-wrapper');?>">
        <div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-thumbnail">
            <a href="<?php echo esc_url(get_permalink()); ?>"><?php
                the_post_thumbnail( 'large', array('alt' => the_title_attribute( 'echo=0' )));
                ?></a>
        </div>
		<div class="<?php echo esc_attr($extra_attr['block_name'])?>__content-wrapper">
				<div class="<?php echo esc_attr($extra_attr['block_name'])?>__entry-header">
					<?php the_title( '<h4 class="'.esc_attr($extra_attr['block_name']).'__post-title"><a href="'.esc_url(get_permalink()).'">', '</a></h4>' ); ?>
					<div class="<?php echo esc_attr($extra_attr['block_name'])?>__entry-meta">
						<span class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-date">
							<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><a href="<?php
								echo get_day_link( $archive_year, $archive_month, $archive_day); ?>"><?php
								echo esc_html( get_the_date( '' ) );
							?></a></time>
						</span>
					</div>
				</div>
			<div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-content"><?php
				echo esc_html( wp_trim_words( get_the_excerpt(), 255 ) );
			?></div>
            <div class="<?php echo esc_attr($extra_attr['block_name'])?>__entry-footer">
                <p class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-categories">
                    <?php echo get_the_category_list(', '); ?>
                </p>
                <p class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-comments">
                    <a href="<?php echo get_comments_link(); ?>"><?php
                    if ( get_comments_number() ) {
                        echo sprintf( _n( '%d Comment', '%d Comments', get_comments_number(), 'getwid' ), get_comments_number() );
                    } else {
                        echo __( 'No comments', 'getwid' );
                    }
                    ?></a>
                </p>
            </div>
		</div>
    </div>
</div>
