<p class='<?php echo esc_attr( $extra_attr['block_name'] );?>'>
    <label
        class='<?php echo esc_attr( $extra_attr['block_name'].'__label');?>'
        for='message-textarea'
    ><?php
        if ( isset( $attributes['label'] ) ) {
            echo $attributes['label'];
        } else {
            echo __('Message', 'getwid');
        }

        if (json_decode($attributes['isRequired'], 'boolean')) {
            ?><span><?php
                echo __(' (required)', 'getwid');
            ?></span><?php
            }
    ?></label>

    <textarea
        rows='5' id='message-textarea'<?php
        if ( isset( $attributes['message'] ) ) { ?>
            placeholder='<?php echo $attributes['message']; ?>'<?php
        } else { ?>
            placeholder='<?php echo __('Enter message here...', 'getwid'); ?>'<?php
        } ?><?php
        if ( json_decode($attributes['isRequired'], 'boolean') ) { ?>
            required='<?php "" ?>'
        <?php } ?>
    ></textarea>
</p>