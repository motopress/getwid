<?php

//extract styles & classes
extract( $extra_attr );

if ( empty( $attributes[ 'customField' ] ) ) {
	return;
}

?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo ( ! empty( $wrapper_style ) ? 'style="' . esc_attr( $wrapper_style ) . '"' : ''); ?>>
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
				<div <?php echo (!empty($foreground_style) ? 'style="'.esc_attr($foreground_style).'"' : '');?> class="<?php echo esc_attr($foreground_class);?>"></div>
				<div <?php echo (!empty($content_container_style) ? 'style="'.esc_attr($content_container_style).'"' : '');?> class="<?php echo esc_attr($content_container_class);?>">
					<?php echo $content; ?>
				</div>
			<?php
		endif;
	?>
</div>
