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
$showCommentsCount = isset( $attributes['showCommentsCount'] ) && $attributes['showCommentsCount'] && comments_open() && get_comments_number();
$showContent = isset( $attributes['showContent'] ) && $attributes['showContent'] != 'none';
$showDate = isset( $attributes['showDate'] ) && $attributes['showDate'];
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php if ( $showTitle ) { ?>
		<?php the_title( '<h3 class="'.esc_attr($extra_attr['block_name']).'__post-title"><a href="'.esc_url(get_permalink()).'">', '</a></h3>' ); ?>
	<?php } ?>

	<?php if ( $showFeaturedImage ) { ?>
	<div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-image">
		<a href="<?php echo esc_url(get_permalink()); ?>">
			<?php the_post_thumbnail( $imageSize, array('alt' => the_title_attribute( 'echo=0' ))); ?>
		</a>
	</div>
	<?php } ?>

	<?php if ( $showCategories ) { ?>
		<div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-categories">
			<?php echo get_the_category_list(', '); ?>
		</div>
	<?php } ?>

	<?php if ( $showTags ) { ?>
		<div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-tags">
			<?php echo get_the_tag_list('', ', ', ''); ?>
		</div>
	<?php } ?>

	<?php if ( $showAuthor ) { ?>
		<div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-author">
			<a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>"><?php echo get_the_author(); ?></a>
		</div>
	<?php } ?>

	<?php if ( $showCommentsCount ) { ?>
		<div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-comments-count">
			<?php echo get_comments_number(); ?>
		</div>
	<?php } ?>

	<?php if ( $showContent ) { ?>
		<div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-content">
			<?php if ($attributes['showContent'] == 'excerpt'){ ?>
				the_exerpt();
			<?php } elseif ($attributes['showContent'] == 'content') {
				the_content();
			} ?>
		</div>
	<?php } ?>

	<?php if ( $showDate ) { ?>
		<div class="<?php echo esc_attr($extra_attr['block_name']); ?>__post-date">
			<time datetime="<?php echo esc_attr( get_the_date( 'c') ); ?>">
				<a href="<?php echo get_day_link( $archive_year, $archive_month, $archive_day); ?>"><?php echo esc_html( get_the_date( '' ) ); ?></a>
			</time>
		</div>
	<?php } ?>

</article>