<?php

//extract styles & classes
extract($extra_attr);

?>

<div class="<?php echo esc_attr( $wrapper_class ); ?>">
    <?php echo ( ! empty( $attributes['customField'] ) ? the_field( $attributes[ 'customField' ] ) : ''); ?>
</div>
