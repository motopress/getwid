<?php
    $class = 'wp-block-getwid-field-textarea';
    $block_name = $class;
    if ( isset( $attributes[ 'className' ] ) ) {
        $class .= ' ' . $attributes[ 'className' ];
    }
    $uid   = isset( $attributes[ 'id' ] )    ? $attributes[ 'id' ] : 'message-' . uniqid();
    $label = isset( $attributes[ 'label' ] ) ? $attributes[ 'label' ] : __( 'Message', 'getwid' );
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
    <textarea
		id='<?php echo esc_attr( $uid ); ?>' rows='<?php echo esc_attr( apply_filters('getwid/blocks/contact_form/textarea_rows', 5) ); ?>' name='message'<?php
        if ( isset( $attributes[ 'placeholder' ] ) ) { ?>
            placeholder='<?php echo esc_attr( $attributes[ 'placeholder' ] ); ?>'<?php
        }

        if ( isset( $attributes[ 'required' ] ) ) { ?>
            required=''
        <?php } ?>
    ></textarea>
</p>
