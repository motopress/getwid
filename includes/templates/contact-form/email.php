<?php
	$uid = uniqid();
?>
<p class='<?php echo esc_attr( $extra_attr['block_name'] );?>'>
    <label
		for="email-<?php echo $uid ?>"
        class='<?php echo esc_attr( $extra_attr['block_name'].'__label');?>'
    ><?php
        if ( isset( $attributes['label'] ) ) {
            echo $attributes['label'];
        } else {
            echo __('Email address', 'getwid');
        }

        if (json_decode($attributes['isRequired'], 'boolean')) {
        ?><span class="required"><?php
            echo __(' (required)', 'getwid');
        ?></span><?php
        }
    ?></label>
    <input value="user1@mail.com"
		id="email-<?php echo $uid ?>"
        type='email' name='email' <?php
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