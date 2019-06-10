<?php
    $class = 'wp-block-getwid-field-textarea';
    $block_name = $class;
    if ( isset( $attributes['className'] ) ) {
        $class .= ' '.esc_attr($attributes['className']);
    }    
	$uid   = isset( $attributes['id'] ) ? $attributes['id'] : uniqid();
?>
<p class='<?php echo esc_attr( $class );?>'>
    <label
		for='message-<?php echo $uid ?>'
        class='<?php echo esc_attr( $block_name.'__label');?>'
    ><?php
        if ( isset( $attributes['label'] ) ) {
            echo $attributes['label'];
        } else {
            echo __('Message', 'getwid');
        }

        if ( isset( $attributes['required'] ) ) {
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
        if ( isset( $attributes['required'] ) ) { ?>
            required='<?php "" ?>'
        <?php } ?>
    ></textarea>
</p>