<?php
	$uid = uniqid();
?>
<p class='<?php echo esc_attr( $extra_attr['block_name'] );?>'>
    <label
		for='message-<?php echo $uid ?>''
        class='<?php echo esc_attr( $extra_attr['block_name'].'__label');?>'
    ><?php
        if ( isset( $attributes['label'] ) ) {
            echo $attributes['label'];
        } else {
            echo __('Message', 'getwid');
        }

        if (json_decode($attributes['isRequired'], 'boolean')) {
            ?><span class="required"><?php
                echo __(' (required)', 'getwid');
            ?></span><?php
            }
    ?></label>

    <textarea
		id='message-<?php echo $uid ?>' rows='5' name='message'<?php
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