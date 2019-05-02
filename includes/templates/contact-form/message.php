<?php

$submit_class = '';
if ($attributes['backgroundColor'] || $attributes['customBackgroundColor']) {
    $submit_class .= ' has-background';

    if (!$attributes['customBackgroundColor']) {
        $submit_class .= ' has-' . $attributes['backgroundColor'] . '-background-color';
    }
}

// var_dump($attributes['backgroundColor']);
// var_dump($submit_class);

?>

<form class='<?php echo esc_attr($extra_attr['block_name'].'__form'); ?>' method='post'>
    <div class='<?php echo esc_attr($extra_attr['block_name'].'__name-wrapper'); ?>'>
    
        <label class='components-base-control__label' for='inspector-text-control-6'>Name</label>
        <input class='components-text-control__input' type='text' name='name' placeholder='Name' required/>
    </div>
    <div class='<?php echo esc_attr($extra_attr['block_name'].'__email-wrapper'); ?>'>
        <label class='components-base-control__label'>Email address</label>
        <input class='components-text-control__input' type='text' name='email' placeholder='Email' required/>
    </div>
    <div class='<?php echo esc_attr($extra_attr['block_name'].'__message-wrapper'); ?>'>
        <label class='components-base-control__label'>Message</label>
        <textarea class='components-textarea-control__input' rows='5' placeholder='Enter message here...' required ></textarea>
    </div>
    <div class='<?php echo esc_attr($extra_attr['block_name'].'__message-wrapper'); ?>'>
        <button class='<?php echo esc_attr('components-button is-button is-primary'.$submit_class); ?>'>SUBNIT</button>
    </div>
</form>