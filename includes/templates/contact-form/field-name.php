<?php
    $class = 'wp-block-getwid-field-name';

	$uid = uniqid();
	$label = isset( $attributes['label'] ) ? $attributes['label'] : __('Name', 'getwid');
?>
<p class='<?php echo esc_attr( $class );?>'>
    <label
		for='name-<?php echo $uid ?>'
        class='<?php echo esc_attr($class . '__label');?>'
    ><?php
        echo $label;

        if ( !isset( $attributes['required'] ) ) {
        ?><span class='required'><?php
            echo __(' (required)', 'getwid');
        ?></span><?php
        }
    ?></label>
    <input id='name-<?php echo $uid ?>' type='text' name='name'<?php
        if ( isset( $attributes['placeholder'] ) ) { ?>
            placeholder='<?php echo $attributes['placeholder']; ?>' <?php
        } else { ?>
            placeholder='<?php echo __('Name', 'getwid'); ?>'<?php
        } ?>

        <?php if ( !isset( $attributes['required'] ) ) { ?>
            required='<?php "" ?>'
        <?php } ?>
    />
</p>
