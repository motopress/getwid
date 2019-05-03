<?php

$inputClass = ' components-textarea-control__input';

$background_color = $attributes['backgroundColor'];
$custom_background_color = $attributes['customBackgroundColor'];

$submit_class .= $background_color || $custom_background_color ? ' has-background' : '';
$submit_class .= $custom_background_color ? ' has-' . $background_color . '-background-color' : '';

$text_color = $attributes['textColor'];
$custom_text_color = $attributes['customTextColor'];

$submit_class .= $text_color || $custom_text_color ? ' has-text-color' : '';
$submit_class .= $custom_text_color ? ' has-' . $text_color . '-color' : '';

?>

<form class='<?php echo esc_attr($extra_attr['block_name'].'__form'); ?>' method='post'>

    <div class='<?php echo esc_attr($extra_attr['block_name'].'__name-wrapper'); ?>'>
        <label class='<?php echo esc_attr($extra_attr['block_name'].'__label'); ?>'>Name</label>
        <input 
            class='<?php echo esc_attr($extra_attr['block_name'].'__name'.$inputClass); ?>' 
            type='text'
            placeholder='Name'
            required
        />
    </div>

    <div class='<?php echo esc_attr($extra_attr['block_name'].'__email-wrapper'); ?>'>
        <label class='<?php echo esc_attr($extra_attr['block_name'].'__label'); ?>'>Email address</label>
        <input
            class='<?php echo esc_attr($extra_attr['block_name'].'__email'.$inputClass); ?>'
            type='text'
            placeholder='Email'
            required
        />
    </div>
    
    <div class='<?php echo esc_attr($extra_attr['block_name'].'__message-wrapper'); ?>'>
        <label class='<?php echo esc_attr($extra_attr['block_name'].'__label'); ?>'>Message</label>
        <textarea class='<?php echo esc_attr($extra_attr['block_name'].'__message'.$inputClass); ?>'
            rows='5'
            placeholder='Enter message here...'
            required
        ></textarea>
    </div>

    <input class='<?php echo esc_attr($extra_attr['block_name'].'__admin-email'); ?>'        
        value='<?php echo esc_attr($attributes['email']); ?>'
        type='hidden'
    />
    <input class='<?php echo esc_attr($extra_attr['block_name'].'__admin-subject'); ?>'        
        value='<?php echo esc_attr($attributes['subject']); ?>'
        type='hidden'
    />

    <button class='<?php echo esc_attr('components-button is-button is-primary'.$submit_class); ?>' type='submit'>SUBNIT</button>

</form>