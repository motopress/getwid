<?php
/**
 * Post template in Instagram Block
 */

$block_name = $extra_attr['block_name'];
$post = $extra_attr['post'];
$showLikes = $attributes['showLikes'];
$showComments = $attributes['showComments'];
$alt = '';
if ( isset($post->caption) ) {
	$alt = wp_trim_words( $post->caption->text );
}

?>
<div class="<?php echo $block_name . '__media-item'; ?>">
	<div class="<?php echo $block_name . '__media-wrapper'; ?>">
		<a class="<?php echo $block_name . '__image-link'; ?>" target="_blank" href="<?php echo esc_url($post->link); ?>">
			<img class="<?php echo $block_name . '__image'; ?>" src="<?php echo esc_url($post->images->standard_resolution->url); ?>" alt="<?php echo esc_attr($alt); ?>"/>
			<?php if ( ($showLikes && isset($post->likes->count)) || ($showComments && $post->comments->count != 0) ) { ?>
			<div class="<?php echo $block_name . '__wrapper-container'; ?>">
				<div class="<?php echo $block_name . '__wrapper-content'; ?>">
					<?php if ($showLikes && isset($post->likes->count)) { ?>
					<span class="<?php echo $block_name . '__likes'; ?>"><i class="fas fa-heart"></i> <?php echo esc_attr($post->likes->count); ?></span><?php
					} ?>
					<?php if ($showComments && $post->comments->count != 0) { ?>
					<span class="<?php echo $block_name . '__comments'; ?>"><i class="fas fa-comment"></i> <?php echo esc_attr($post->comments->count); ?></span><?php
					} ?>
				</div>
			</div>
			<?php } ?>
		</a>
	</div>
</div>