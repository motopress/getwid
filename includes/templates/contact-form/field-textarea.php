<?php
    $class = 'wp-block-getwid-field-textarea';
    $block_name = $class;
    if ( isset( $attributes[ 'className' ] ) ) {
        $class .= ' ' . $attributes[ 'className' ];
    }    
    $uid   = isset( $attributes[ 'id' ] )    ? esc_attr( $attributes[ 'id' ] ) : 'message-' . uniqid();
    $label = isset( $attributes[ 'label' ] ) ? $attributes[ 'label' ] : __( 'Message', 'getwid' );
?>
<p class='<?php echo esc_attr( $class );?>'>
    <label
		for='<?php echo $uid ?>'
        class='<?php echo esc_attr( $block_name . '__label' );?>'
    ><?php
        echo $label;

        if ( isset( $attributes[ 'required' ] ) ) {
        ?><span class="required"><?php
            echo __( ' (required)', 'getwid' );
        ?></span><?php
        }
    ?></label>

    <textarea
		id='<?php echo $uid ?>' rows='5' name='message'<?php
        if ( isset( $attributes[ 'placeholder' ] ) ) { ?>
            placeholder='<?php echo esc_attr( $attributes['placeholder'] ); ?>'<?php
        } else { ?>
            placeholder='<?php echo __( 'Enter message here...', 'getwid' ); ?>'<?php
        } ?><?php
        if ( isset( $attributes[ 'required' ] ) ) { ?>
            required='<?php "" ?>'
        <?php } ?>
    ></textarea>
</p>