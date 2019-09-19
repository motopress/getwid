<?php
    $class = 'wp-block-getwid-field-last-name';
    $block_name = $class;
    if ( isset( $attributes[ 'className' ] ) ) {
        $class .= ' ' . $attributes[ 'className' ];
    }
    $uid = isset( $attributes[ 'id'   ] ) ? esc_attr( $attributes[ 'id' ] ) : 'name-' . uniqid();
    $label = isset( $attributes[ 'label' ] ) ? $attributes[ 'label' ] : __( 'Last name', 'getwid' );
?>
<p class='<?php echo esc_attr( $class );?>'><?php
    if ( ! empty( $label ) ) : ?>
        <label
            for='<?php echo $uid ?>'
            class='<?php echo esc_attr( $block_name . '__label' );?>'
        ><?php
            echo $label;
        ?></label>
    <?php endif; ?>

    <input id='<?php echo $uid ?>' type='text' name='last-name'<?php
        if ( isset( $attributes[ 'placeholder' ] ) ) { ?>
            placeholder='<?php echo esc_attr( $attributes[ 'placeholder' ] ); ?>' <?php
        } ?>

        <?php if ( isset( $attributes[ 'required' ] ) ) { ?>
            required='<?php "" ?>'
        <?php } ?>
    />
</p>