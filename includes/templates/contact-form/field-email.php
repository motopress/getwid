<?php
    $class = 'wp-block-getwid-field-email';
    $uid   = isset( $attributes['id'] ) ? $attributes['id'] : uniqid();
?>
<p class='<?php echo esc_attr( $class );?>'>
    <label
		for='email-<?php echo $uid ?>''
        class='<?php echo esc_attr( $class.'__label');?>'
    ><?php
        if ( isset( $attributes['label'] ) ) {
            echo $attributes['label'];
        } else {
            echo __('Email address', 'getwid');
        }

        if ( isset( $attributes['required'] ) ) {
        ?><span class='required'><?php
            echo __(' (required)', 'getwid');
        ?></span><?php
        }
    ?></label>
    <input id='email-<?php echo $uid ?>' type='email' name='email' <?php
        if ( isset( $attributes['placeholder'] ) ) { ?>
            placeholder='<?php echo $attributes['placeholder']; ?>'<?php
        } else { ?>
            placeholder='<?php echo __('Email', 'getwid'); ?>'<?php
        }

        if ( isset( $attributes['required'] ) ) { ?>
            required='<?php "" ?>'<?php
        } ?>
    />
</p>