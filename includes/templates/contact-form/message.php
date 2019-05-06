
<form class='<?php echo esc_attr($extra_attr['block_name']); ?>' method='post'>

    <div class='<?php echo esc_attr($extra_attr['block_name'].'__fields-wrapper'); ?>'>

        <div class='<?php echo esc_attr($extra_attr['block_name'].'__name-wrapper'); ?>'>
            <label class='<?php echo esc_attr($extra_attr['block_name'].'__label'); ?>'> <?php _e('Name','getwid') ?> </label>
            <input 
                class='<?php echo esc_attr($extra_attr['block_name'].'__name'); ?>' 
                type='text'
                placeholder=<?php _e('Name','getwid') ?>
                required
            />
        </div>

        <div class='<?php echo esc_attr($extra_attr['block_name'].'__from-wrapper'); ?>'>
            <label class='<?php echo esc_attr($extra_attr['block_name'].'__label'); ?>'> <?php _e('Email address','getwid') ?> </label>
            <input
                class='<?php echo esc_attr($extra_attr['block_name'].'__from'); ?>'
                type='text'
                placeholder=<?php _e('Email','getwid') ?>
                required
            />
        </div>
        
        <div class='<?php echo esc_attr($extra_attr['block_name'].'__message-wrapper'); ?>'>
            <label class='<?php echo esc_attr($extra_attr['block_name'].'__label'); ?>'> <?php _e('Message','getwid') ?> </label>
            <textarea class='<?php echo esc_attr($extra_attr['block_name'].'__message'); ?>'
                rows='5'
                placeholder=<?php _e('Enter message here...','getwid') ?>
                required
            ></textarea>
        </div>

        <span class='<?php echo esc_attr($extra_attr['block_name'].'__response'); ?>' > <?php _e('','getwid') ?> </span>

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
        class='<?php echo esc_attr($extra_attr['submit']); ?>'

        <?php if ( isset( $extra_attr['style'] ) ) { ?>
            style='<?php echo esc_attr($extra_attr['style']) ?>'
        <?php } ?>
        
        type='submit'
    >
        <?php _e('Submit','getwid') ?> </button>

</form>