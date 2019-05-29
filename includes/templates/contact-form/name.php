<p class='<?php echo esc_attr( $extra_attr['block_name'] );?>'>
    <label
        class='<?php echo esc_attr($extra_attr['block_name'].'__label');?>'
        for='name-input'
    ><?php
        if ( isset( $attributes['label'] ) ) {
            echo $attributes['label'];
        } else {
            echo __('Name', 'getwid');
        }
        
        if (json_decode($attributes['isRequired'], 'boolean')) {
        ?><span><?php
            echo __(' (required)', 'getwid');
        ?></span><?php
        } 
    ?></label>
    <input
        type='text' id='name-input' autofocus='true'<?php
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
