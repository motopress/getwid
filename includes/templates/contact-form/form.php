<form class="contact-form"><?php

	echo $extra_attr['content'];

	?>
	<input name='subject'
		value='<?php echo esc_attr($attributes['subject']); ?>'
		type='hidden'
	/>

	<p class="wp-block-getwid-contact-form__result"></p>

	<button
        type='submit'
        class='<?php echo esc_attr('wp-block-button' . $extra_attr['button_class']); ?>'<?php
        if ( isset( $extra_attr['button_style'] ) ) { ?>
            style='<?php echo esc_attr($extra_attr['button_style']); ?>'<?php
        } ?>
    ><?php
        if ( isset( $attributes['text'] ) ) {
            echo $attributes['text'];
        } else {
            echo __('Submit', 'getwid');
        }
    ?></button>
</form>