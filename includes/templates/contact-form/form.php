<div class='<?php echo esc_attr( $extra_attr['block_name'] );?>'>
    <form class='<?php echo esc_attr( $extra_attr['block_name'].'__form' ); ?>'>
        <div class='<?php echo esc_attr($extra_attr['block_name'].'__fields-wrapper'); ?>'>

            <?php echo $extra_attr['content']; ?>

            <span
                class='<?php echo esc_attr($extra_attr['block_name'].'__message'); ?>'
            >
                <?php _e('', 'getwid') ?>
            </span>

            <input class='<?php echo esc_attr($extra_attr['block_name'].'__to'); ?>'
                value='<?php echo esc_attr($attributes['to']); ?>'
                type='hidden'
            />

            <input class='<?php echo esc_attr($extra_attr['block_name'].'__subject'); ?>'
                value='<?php echo esc_attr($attributes['subject']); ?>'
                type='hidden'
            />
        </div>

        <button
            class='<?php echo esc_attr('wp-block-button' . $extra_attr['button_class']); ?>'<?php
            if ( isset( $extra_attr['button_style'] ) ) { ?>
                style='<?php echo esc_attr($extra_attr['button_style']) ?>'<?php
            } ?>
            type='submit'
        >
            <?php echo __('Submit', 'getwid') ?>
        </button>
    </form>
</div>