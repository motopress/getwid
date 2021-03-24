<?php

// extract styles & classes
extract( $extra_attr );

?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>">
	<?php
		$field = get_field_object( $attributes[ 'customField' ], get_the_ID() );

	 	if ( $field ) :
	 		$output 	 = '';
	 		$fieldType   = $field[ 'type' ];
			$fieldValue  = $field[ 'value' ];
            $fieldLabel  = $field[ 'choices' ][ $fieldValue ];

			switch ( $fieldType ) {
				case 'select' :
					$output = $fieldLabel;
	 		}

	 		echo $output;
		endif;
	?>
</div>
