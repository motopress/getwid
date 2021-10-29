<form class='wp-block-getwid-mailchimp__form'>
	<?php echo $extra_attr[ 'content' ]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

	<input name='list_ids' <?php
		$data = json_encode( $attributes[ 'ids' ] );

		if ( isset( $attributes[ 'ids' ] ) ) {?>
			value='<?php echo esc_attr( $data ); ?>'<?php
		}?>
		type='hidden'
	/>

	<p class='<?php echo esc_attr( $extra_attr[ 'block_name' ] . '__result' ); ?>'></p>

	<div class='<?php echo esc_attr( $extra_attr[ 'block_name' ] . '__submit' ); ?>'>
		<div class='wp-block-button'>
			<button
				type='submit'
				class='<?php echo esc_attr( 'wp-block-button__link ' . $extra_attr[ 'button_class' ] ); ?>'<?php
				if ( isset( $extra_attr[ 'button_style' ] ) ) { ?>
					style='<?php echo esc_attr( $extra_attr[ 'button_style' ] ); ?>'<?php
				} ?>
			><?php
				if ( isset( $attributes[ 'text' ] ) && $attributes[ 'text' ] != '' ) {
					echo wp_kses_post( $attributes[ 'text' ] );
				} else {
					echo esc_html__( 'Subscribe', 'getwid' );
				}
			?></button>
		</div>

	</div>
</form>
