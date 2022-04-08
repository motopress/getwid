<?php
    $class = 'wp-block-getwid-field-email';
    $block_name = $class;
    if ( isset( $attributes[ 'className' ] ) ) {
        $class .= ' ' . $attributes[ 'className' ];
    }
    $uid   = isset( $attributes[ 'id' ] )    ? $attributes[ 'id' ] : 'email-' . uniqid();
    $label = isset( $attributes[ 'label' ] ) ? $attributes[ 'label' ] : __( 'Email address', 'getwid' );
?>
<p class='<?php echo esc_attr( $class );?>'>
	<?php if ( !empty($label) ) : ?>
    <label
		for='<?php echo esc_attr( $uid ); ?>'
        class='<?php echo esc_attr( $block_name . '__label' );?>'
    ><?php
        echo wp_kses_post( $label );
    ?></label>
	<?php endif; ?>
    <input id='<?php echo esc_attr( $uid ); ?>' type='email' name='email' <?php
        if ( isset( $attributes[ 'placeholder' ] ) ) { ?>
            placeholder='<?php echo esc_attr( $attributes[ 'placeholder' ] ); ?>' <?php
        }

        if ( isset( $attributes[ 'required' ] ) ) { ?>
            required=''<?php
        } ?>
    />
</p>
