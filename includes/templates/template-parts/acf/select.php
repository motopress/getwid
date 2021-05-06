<?php

// extract styles & classes
extract( $extra_attr );

?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo ( ! empty( $wrapper_style ) ? 'style="' . esc_attr( $wrapper_style ) . '"' : ''); ?>>
	<?php if ( ! empty( $attributes[ 'labelName' ] ) ) { ?>
		<span class="<?php echo esc_attr( $wrapper_class . '__label' ); ?>"><?php echo $attributes[ 'labelName' ]; ?></span>
	<?php } ?>
	<?php
		if ( empty( $attributes[ 'customField' ] ) ) {
			return;
		}

		$field  = get_field_object( $attributes[ 'customField' ], get_the_ID() );

	 	if ( $field ) :
	 		$output    = '';
	 		$fieldType = $field[ 'type' ];

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

									$output .= '<span class="' . esc_attr( 'custom-field-select--' . strtolower( $getValue ) ) . '">';
										$output .= $getValue;
									$output .= '</span>';

									if ( $numCount < $numOfItems ) {
										$output .= $attributes[ 'separator' ] . ' ';
									}
								}
							} else {
								$output .= '<span class="' . esc_attr( 'custom-field-select--' . strtolower( $fieldValue ) ) . '">';
									$output .= $fieldValue;
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

									$output .= '<span class="' . esc_attr( 'custom-field-select--' . strtolower( $getValueArray ) ) . '">';
										$output .= $getBothArray;
									$output .= '</span>';

									if ( $numCount < $numOfItems ) {
										$output .= $attributes[ 'separator' ] . ' ';
									}
								}
							} else {
								$output .= '<span class="' . esc_attr( 'custom-field-select--' . strtolower( $fieldValue[ 'value' ] ) ) . '">';
									$output .= $fieldValue[ 'value' ] . ': ' . $fieldValue[ 'label' ];
								$output .= '</span>';
							}

							break;
					}

					break;
	 		}

	 		echo $output;
		endif;
	?>
</div>
