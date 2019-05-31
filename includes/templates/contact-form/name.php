<?php
	$uid = uniqid();
	$label = isset( $attributes['label'] ) ? $attributes['label'] : __('Name', 'getwid');
	$block_name = $extra_attr['block_name'];
?>
<p class='<?php echo esc_attr( $block_name );?>'>
    <label
		for='name-<?php echo $uid ?>'
        class='<?php echo esc_attr($block_name . '__label');?>'
    ><?php
        echo $label;

        if (json_decode($attributes['isRequired'], 'boolean')) {
        ?><span class='required'><?php
            echo __(' (required)', 'getwid');
        ?></span><?php
        }
    ?></label>
    <input id='name-<?php echo $uid ?>' type='text' name='name'<?php
        if ( isset( $attributes['name'] ) ) { ?>
            placeholder='<?php echo $attributes['name']; ?>' <?php
        } else { ?>
            placeholder='<?php echo __('Name', 'getwid'); ?>'<?php
        } ?>

        <?php if ( json_decode($attributes['isRequired'], 'boolean') ) { ?>
            required='<?php "" ?>'
        <?php } ?>
    />
</p>
