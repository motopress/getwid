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
<div class="<?php echo esc_attr($block_name) . '__item'; ?>">
	<div class="<?php echo esc_attr($block_name) . '__media-wrapper'; ?>">
		<a class="<?php echo esc_attr($block_name) . '__media-link'; ?>" target="_blank" href="<?php echo esc_url($post->link); ?>">
			<img class="<?php echo esc_attr($block_name) . '__media'; ?>" src="<?php echo esc_url($post->images->standard_resolution->url); ?>" alt="<?php echo esc_attr($alt); ?>"/>
			<?php if ( ($showLikes && isset($post->likes->count)) || ($showComments && $post->comments->count != 0) ) { ?>
			<div class="<?php echo esc_attr($block_name) . '__meta-wrapper'; ?>">
				<div class="<?php echo esc_attr($block_name) . '__meta'; ?>">
					<?php if ($showLikes && isset($post->likes->count)) { ?>
					<span class="<?php echo esc_attr($block_name) . '__likes'; ?>"><i class="getwid-icon getwid-icon-like"></i> <?php echo esc_attr($post->likes->count); ?></span><?php
					} ?>
					<?php if ($showComments && $post->comments->count != 0) { ?>
					<span class="<?php echo esc_attr($block_name) . '__comments'; ?>"><i class="getwid-icon getwid-icon-comment"></i> <?php echo esc_attr($post->comments->count); ?></span><?php
					} ?>
				</div>
			</div>
			<?php } ?>
		</a>
	</div>
</div>