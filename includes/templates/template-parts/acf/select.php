<?php

// extract styles & classes
extract( $extra_attr );

if ( empty( $attributes[ 'customField' ] ) ) {
	return;
}

?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php if ( ! empty( $wrapper_style ) ) { ?> style="<?php echo esc_attr( $wrapper_style ); ?>" <?php } ?>>

	<?php
		$field  = get_field_object( $attributes[ 'customField' ], get_the_ID() );

	 	if ( $field ) :
	 		$output    = '';
	 		$fieldType = $field[ 'type' ];

 			if ( ! empty( $attributes[ 'labelName' ] ) ) {
				$output .= '<span class="' . esc_attr( 'wp-block-getwid-template-acf-select__label' ) . '">' . esc_html( $attributes[ 'labelName' ] ) . '</span>';
			}

			switch ( $fieldType ) {
				case 'select' :
					$fieldIsMultiple   = $field[ 'multiple' ];
					$fieldReturnFormat = $field[ 'return_format' ];
					$fieldValue  	   = $field[ 'value' ];

					switch ( $fieldReturnFormat ) {
						case 'value' :
						case 'label' : {
							if ( $fieldIsMultiple ) {
								$numCount   = 0;
								$numOfItems = count( $fieldValue );

								foreach ( $fieldValue as $value ) {
									$numCount = $numCount + 1;
									$getValue = $value;

									$output .= '<span class="wp-block-getwid-template-acf-select__value ' . esc_attr( 'option-' . strtolower( $getValue ) ) . '">';
										$output .= esc_html( $getValue );
									$output .= '</span>';

									if ( $numCount < $numOfItems ) {
										$output .= esc_html( $attributes[ 'separator' ] );
									}
								}
							} else {
								$output .= '<span class="wp-block-getwid-template-acf-select__value ' . esc_attr( 'option-' . strtolower( $fieldValue ) ) . '">';
									$output .= esc_html( $fieldValue );
								$output .= '</span>';
							}

							break;
						}
						case 'array' :
							if ( $fieldIsMultiple ) {
							  	$numCount   = 0;
 								$numOfItems = count( $fieldValue );

								foreach ( $fieldValue as $value ) {
								    $numCount 	   = $numCount + 1;
									$getBothArray  = $value[ 'value' ] . ': ' . $value[ 'label' ];
									$getValueArray = $value[ 'value' ];

									$output .= '<span class="wp-block-getwid-template-acf-select__value ' . esc_attr( 'option-' . strtolower( $getValueArray ) ) . '">';
										$output .= esc_html( $getBothArray );
									$output .= '</span>';

									if ( $numCount < $numOfItems ) {
										$output .= esc_html( $attributes[ 'separator' ] );
									}
								}
							} else {
								$output .= '<span class="wp-block-getwid-template-acf-select__value ' . esc_attr( 'option-' . strtolower( $fieldValue[ 'value' ] ) ) . '">';
									$output .= esc_html( $fieldValue[ 'value' ] . ': ' . $fieldValue[ 'label' ] );
								$output .= '</span>';
							}

							break;
					}

					break;
	 		}

	 		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		endif;
	?>
</div>
