<p class='<?php echo esc_attr( $extra_attr['block_name'] );?>'>
    <label
        class='<?php echo esc_attr( $extra_attr['block_name'].'__label');?>'
        for='email-input'
    ><?php
        if ( isset( $attributes['label'] ) ) {
            echo $attributes['label'];
        } else {
            echo __('Email address', 'getwid');
        }

        if (json_decode($attributes['isRequired'], 'boolean')) {
        ?><span><?php
            echo __(' (required)', 'getwid');
        ?></span><?php
        }
    ?></label>
    <input
        type='email' id='email-input' <?php
        if ( isset( $attributes['email'] ) ) { ?>
            placeholder='<?php echo $attributes['email']; ?>'<?php
        } else { ?>
            placeholder='<?php echo __('Email', 'getwid'); ?>'<?php
        }

        if ( json_decode($attributes['isRequired'], 'boolean') ) { ?>
            required='<?php "" ?>'<?php
        } ?>
    />
</p>