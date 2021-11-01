<?php

//extract styles & classes
extract( $extra_attr );

if ( empty( $attributes[ 'customField' ] ) ) {
	return;
}

?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php if ( ! empty( $wrapper_style ) ) { ?> style="<?php echo esc_attr( $wrapper_style ); ?>"<?php } ?>>
	<?php

		$field = get_field_object( $attributes[ 'customField' ], get_the_ID() );

		if ( $field ) :
			$img_id 	 = '';
			$fieldType   = $field[ 'type' ];
			$filedFormat = $field[ 'return_format' ];

			switch ( $fieldType ) {
				case 'image' :
					$image = get_field( $attributes[ 'customField' ], get_the_ID() );

					switch ( $filedFormat ) {
						case 'id' :
							$img_id = $image;

							break;
						case 'url' :
							$img_id = attachment_url_to_postid( $image );

							break;
						case 'array' :
							$img_id = $image[ 'ID' ];

							break;
					}

					break;
			}

			?>
				<div class="<?php echo esc_attr( $block_name ); ?>__image" style="background-image: url(<?php echo esc_url(wp_get_attachment_image_url($img_id, $imageSize))?>);"></div>
				<div <?php if ( !empty($foreground_style) ) { ?> style="<?php echo esc_attr($foreground_style); ?>" <?php } ?> class="<?php echo esc_attr($foreground_class);?>"></div>
				<div <?php if ( !empty($content_container_style) ) { ?> style="<?php echo esc_attr($content_container_style); ?>" <?php } ?> class="<?php echo esc_attr($content_container_class);?>">
					<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</div>
			<?php
		endif;
	?>
</div>
