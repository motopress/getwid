<?php

// extract styles & classes
extract( $extra_attr );

?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>">
	<?php

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
								$output .= '<span class="' . esc_attr( 'wp-block-getwid-template-post-select-acf-' . strtolower( implode( ' wp-block-getwid-template-post-select-acf-', $fieldValue ) ) ) . '">';
									$output .= implode( ', ', $fieldValue );
								$output .= '</span>';
							} else {
								$output .= '<span class="' . esc_attr( 'wp-block-getwid-template-post-select-acf-' . strtolower( $fieldValue ) ) . '">';
									$output .= $fieldValue;
								$output .= '</span>';
							}

							break;
						}
						case 'array' :
							if ( $fieldIsMultiple ) {
								$labelArr = [];
								$valueArr = [];

								foreach ( $fieldValue as $value ) {
									$getBothArray  = $value[ 'value' ] . ': ' . $value[ 'label' ];
									$getValueArray = $value[ 'value' ];

									array_push( $labelArr, $getBothArray );
									array_push( $valueArr, $getValueArray );
								}

								$output .= '<span class="' . esc_attr( 'wp-block-getwid-template-post-select-acf-' . strtolower( implode( ' wp-block-getwid-template-post-select-acf-', $valueArr ) ) ) . '">';
									$output .= implode( ', ', $labelArr );
								$output .= '</span>';
							} else {
								$output .= '<span class="' . esc_attr( 'wp-block-getwid-template-post-select-acf-' . strtolower( $fieldValue[ 'value' ] ) ) . '">';
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
