<form class='<?php echo esc_attr( $extra_attr[ 'class' ] . '__form' ); ?>'>
	<?php echo $extra_attr[ 'content' ]; ?><?php

	if ( $extra_attr[ 'block_name' ] == 'contact-form' ) {?>
		<input name='subject' <?php
			if ( isset( $attributes[ 'subject' ] ) ) {?>
				value='<?php echo esc_attr( $attributes[ 'subject' ] ); ?>'<?php
			}?>
			type='hidden'
		/><?php
	} else {?>
		<input name='list_ids' <?php
			$data = json_encode( $attributes[ 'ids' ] );
			
			if ( isset( $attributes[ 'ids' ] ) ) {?>
				value='<?php echo esc_attr( $data ); ?>'<?php
			}?>
			type='hidden'
		/><?php
	}?>
    
	<p class='<?php echo esc_attr( $extra_attr[ 'class' ] . '__result' ); ?>'></p>

	<div class='<?php echo esc_attr( $extra_attr[ 'class' ] . '__submit' ); ?>'>
		<div class='wp-block-button'>
			<button
				type='submit'
				class='<?php echo esc_attr( 'wp-block-button__link ' . $extra_attr[ 'button_class' ] ); ?>'<?php
				if ( isset( $extra_attr[ 'button_style' ] ) ) { ?>
					style='<?php echo esc_attr( $extra_attr[ 'button_style' ] ); ?>'<?php
				} ?>
			><?php
				if ( isset( $attributes[ 'text' ] ) && $attributes[ 'text' ] != '' ) {
					echo $attributes[ 'text' ];
				} else {
					if ( $extra_attr[ 'block_name' ] == 'contact-form' ) {
						echo __( 'Submit', 'getwid' );
					} else {
						echo __( 'Subscribe', 'getwid' );
					}
				}
			?></button>
		</div>

	</div>
</form>