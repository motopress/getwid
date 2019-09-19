<form class='wp-block-getwid-contact-form__form'>
    <?php echo $extra_attr[ 'content' ]; ?>

    <input name='subject' <?php
        if ( isset( $attributes[ 'subject' ] ) ) {?>
            value='<?php echo esc_attr( $attributes[ 'subject' ] ); ?>'<?php
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
				if ( isset( $attributes[ 'text' ] ) ) {
					echo $attributes[ 'text' ];
				} else {
					echo __( 'Submit', 'getwid' );
				}
			?></button>
		</div>

	</div>
</form>