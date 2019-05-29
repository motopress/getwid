<?php

function render_getwid_template_post_link( $attributes ) {


// var_dump($attributes);

    $block_name = 'wp-block-getwid-template-post-link';
    
    $wrapper_class = $block_name;
    $wrapper_class .= ' wp-block-button';

    $wrapper_style = '';
    //Classes
    if ( isset( $attributes['className'] ) ) {
        $wrapper_class .= ' '.$attributes['className'];
    }

    if ( isset( $attributes['align'] ) ) {
        $wrapper_class .= ' align' . $attributes['align'];
    }
    if ( isset( $attributes['textAlignment']) ) {
        $wrapper_style .= 'text-align: '.esc_attr($attributes['textAlignment']).';';
    }

    $is_back_end = \defined( 'REST_REQUEST' ) && REST_REQUEST && ! empty( $_REQUEST['context'] ) && 'edit' === $_REQUEST['context'];
    
    //Link style & class
    $link_style = '';
    $link_class = 'wp-block-button__link';
    //Baclground
    if (isset( $attributes['backgroundColor']) || isset( $attributes['customBackgroundColor'] )){
        preg_match('/^#/', $attributes['backgroundColor'], $matches);
        //HEX
        $backgroundColorHEX = '';
        if (isset($matches[0])){
            $backgroundColorHEX = $attributes['backgroundColor'];
        }
        //String
        else {
            $get_colors = get_theme_support('editor-color-palette')[0];
            foreach ($get_colors as $key => $value) {
                if ($value['slug'] == $attributes['backgroundColor']){
                    $backgroundColorHEX =  $value['color'];
                }
            }        
        }    
        if ($is_back_end){
            $link_style .= 'background-color: '.(isset( $attributes['customBackgroundColor'] ) ? $attributes['customBackgroundColor'] : $backgroundColorHEX).';';
        } else {
            if (isset($attributes['customBackgroundColor'])){
                $link_style .= 'background-color: '.$attributes['customBackgroundColor'].';';
            } else {
                $link_class .= ' has-background has-' . $attributes['backgroundColor'] . '-background-color';
            }
        } 
    } 

    //Color
    if (isset( $attributes['textColor']) || isset( $attributes['customTextColor'] )){
        preg_match('/^#/', $attributes['textColor'], $matches);
        //HEX
        $textColorHEX = '';
        if (isset($matches[0])){
            $textColorHEX = $attributes['textColor'];
        }
        //String
        else {
            $get_colors = get_theme_support('editor-color-palette')[0];
            foreach ($get_colors as $key => $value) {
                if ($value['slug'] == $attributes['textColor']){
                    $textColorHEX =  $value['color'];
                }
            }        
        }
        if ($is_back_end){
            $link_style .= 'color: '.(isset( $attributes['customTextColor'] ) ? $attributes['customTextColor'] : $textColorHEX).';';
        } else {
            if (isset($attributes['customTextColor'])){
                $link_style .= 'color: '.$attributes['customTextColor'].';';
            } else {
                $link_class .= ' has-text-color has-' . $attributes['textColor'] . '-color';
            }
        }
    }
    $link_style = trim($link_style);
    $link_class = trim($link_class);
    ob_start();
    ?>    
        <div class="<?php echo esc_attr( $wrapper_class ); ?>" <?php echo (!empty($wrapper_style) ? 'style="'.esc_attr($wrapper_style).'"' : '');?>>
            <a href="<?php echo esc_url(get_permalink()); ?>" <?php echo (!empty($link_style) ? 'style="'.esc_attr($link_style).'"' : '');?> <?php echo (!empty($link_class) ? 'class="'.esc_attr($link_class).'"' : '');?>><?php echo $attributes['buttonText']; ?></a>
        </div>
    <?php

    $result = ob_get_clean();
    return $result;    
}
register_block_type(
    'getwid/template-post-link',
    array(
        'attributes' => array(
            //Colors
            'textColor' => array(
                'type' => 'string',
            ),
            'customTextColor' => array(
                'type' => 'string',
            ),
            'backgroundColor' => array(
                'type' => 'string',
            ),        
            'customBackgroundColor' => array(
                'type' => 'string',
            ),
            //Colors
        

            'buttonText' => array(
                'type' => 'string',
                'default' => __('Read More', 'getwid'),
            ),
            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
            ),
        ),
        'render_callback' => 'render_getwid_template_post_link',
    )
);