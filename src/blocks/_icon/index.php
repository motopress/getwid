<?php

//Editor JS
wp_register_script(
    "{$this->prefix}-{$block_name}-editor",
    plugins_url( 'block.js', __FILE__ ),
    // plugins_url( 'editor.js', __FILE__ ),
    null // array( 'wp-blocks', 'wp-element' )
);

//Editor CSS
wp_register_style(
    "{$this->prefix}-{$block_name}-editor",
    plugins_url( 'css/editor.css', __FILE__ ),
    null
);

//Frontend JS
wp_register_script(
    "{$this->prefix}-{$block_name}-frontend",
    plugins_url( 'js/frontend.js', __FILE__ ),
    null
);

//Frontend CSS
wp_register_style(
    "{$this->prefix}-{$block_name}-frontend",
    plugins_url( 'css/style.css', __FILE__ ),
    null
);


//Register block
register_block_type( '{$this->prefix}/{$block_name}', array(
    'editor_script'     => "{$this->prefix}-{$block_name}-editor", //editor-js
    // 'editor_style'      => "{$this->prefix}-{$block_name}-editor", //editor-css
    // 'script'            => "{$this->prefix}-{$block_name}-frontend", //frontend-js
    // 'style'             => "{$this->prefix}-{$block_name}-frontend", //frontend-css
) );