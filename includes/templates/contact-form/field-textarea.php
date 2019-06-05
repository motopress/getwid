<?php
    $class = 'wp-block-getwid-field-textarea';
	$uid = uniqid();
?>
<p class='<?php echo esc_attr( $class );?>'>
    <label
		for='message-<?php echo $uid ?>'
        class='<?php echo esc_attr( $class.'__label');?>'
    ><?php
        if ( isset( $attributes['label'] ) ) {
            echo $attributes['label'];
        } else {
            echo __('Message', 'getwid');
        }

        if ( !isset( $attributes['required'] ) ) {
        ?><span class="required"><?php
            echo __(' (required)', 'getwid');
        ?></span><?php
        }
    ?></label>

    <textarea
		id='message-<?php echo $uid ?>' rows='5' name='message'<?php
        if ( isset( $attributes['placeholder'] ) ) { ?>
            placeholder='<?php echo $attributes['placeholder']; ?>'<?php
        } else { ?>
            placeholder='<?php echo __('Enter message here...', 'getwid'); ?>'<?php
        } ?><?php
        if ( !isset( $attributes['required'] ) ) { ?>
            required='<?php "" ?>'
        <?php } ?>
    ></textarea>
</p>