<p class='<?php echo esc_attr( $extra_attr['block_name'] );?>'>
    <label
        class='<?php echo esc_attr( $extra_attr['block_name'].'__label');?>'
        for='message-textarea'
    ><?php
        if ( isset( $attributes['label'] ) ) {
            echo $attributes['label'];
        } else {
            echo _e('Message', 'getwid');
        } 
    ?></label>

    <textarea
        rows='5' id='message-textarea'
        <?php if ( isset( $attributes['message'] ) ) { ?>
            placeholder='<?php echo $attributes['message']; ?>'
        <?php } else { ?>
            placeholder='<?php echo _e('Enter message here...', 'getwid'); ?>'
        <?php } ?>
    ></textarea>
</p>