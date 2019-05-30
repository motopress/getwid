
<form>
    <div class='<?php echo esc_attr($extra_attr['block_name'].'__wrapper'); ?>'>

        <?php echo $extra_attr['content']; ?>        

        <input id='to-input'
            value='<?php echo esc_attr($attributes['to']); ?>'
            type='hidden'            
        />

        <input id='subject-input'
            value='<?php echo esc_attr($attributes['subject']); ?>'
            type='hidden'
        />
        
    </div> <?php
        if ( json_decode( $attributes['captcha'], 'boolean' ) ) { ?>
            <div class='<?php echo esc_attr($extra_attr['block_name'].'__captcha'); ?>'></div> <?php
        } ?>

    <button
        type='submit'
        class='<?php echo esc_attr('wp-block-button' . $extra_attr['button_class']); ?>'<?php
        if ( isset( $extra_attr['button_style'] ) ) { ?>
            style='<?php echo esc_attr($extra_attr['button_style']); ?>'<?php
        } ?>
    ><?php
        echo __('Submit', 'getwid'); ?>
    </button>
</form>
