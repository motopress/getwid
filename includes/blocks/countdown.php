<?php

function render_getwid_countdown( $attributes, $content ) {

    $block_name = 'wp-block-getwid-countdown';
    $class = $block_name;

    //Classes
    if ( isset( $attributes['className'] ) ) {
        $class .= ' '.esc_attr($attributes['className']);
    }    
    if ( isset( $attributes['align'] ) ) {
        $class .= ' align' . esc_attr($attributes['align']);
    }
    if ( isset( $attributes['textAlignment'] ) ) {
        $class .= ' has-horizontal-alignment-' . esc_attr($attributes['textAlignment']);
    }
    if ( isset( $attributes['fontSizeTablet'] ) && $attributes['fontSizeTablet'] != 'fs-tablet-100' ) {
        $class .= ' '.esc_attr($attributes['fontSizeTablet']);
    }    
    if ( isset( $attributes['fontSizeMobile'] ) && $attributes['fontSizeMobile'] != 'fs-mobile-100' ) {
        $class .= ' '.esc_attr($attributes['fontSizeMobile']);
    } 
    if (isset($attributes['fontSize'])){
        $class .= ' has-'.esc_attr($attributes['fontSize']).'-font-size';
    }    

    $content_class = esc_attr($block_name).'__content';
    $wrapper_class = esc_attr($block_name).'__wrapper';


    $style = '';
    $content_style = '';
    //Style
    if ( isset( $attributes['customFontSize']) ) {
        $style .= 'font-size: '.esc_attr($attributes['customFontSize']).'px;';
    }

    if ( isset( $attributes['fontFamily']) && $attributes['fontFamily'] !='' ) {
        $content_style .= 'font-family: '.esc_attr($attributes['fontFamily']).';';
    }
    if ( isset( $attributes['fontWeight']) ) {
        $content_style .= 'font-weight: '.esc_attr($attributes['fontWeight']).';';
    }
    if ( isset( $attributes['fontStyle']) ) {
        $content_style .= 'font-style: '.esc_attr($attributes['fontStyle']).';';
    }
    if ( isset( $attributes['textTransform']) ) {
        $content_style .= 'text-transform: '.esc_attr($attributes['textTransform']).';';
    }
    if ( isset( $attributes['lineHeight']) ) {
        $content_style .= 'line-height: '.esc_attr($attributes['lineHeight']).';';
    }
    if ( isset( $attributes['letterSpacing']) ) {
        $content_style .= 'letter-spacing: '.esc_attr($attributes['letterSpacing']).';';
    }

    $countdownData = array(
        'dateTime' => isset($attributes['dateTime']) ? $attributes['dateTime'] : '',
        'year' => $attributes['year'],
        'months' => $attributes['months'],
        'weeks' => $attributes['weeks'],
        'days' => $attributes['days'],
        'hours' => $attributes['hours'],
        'minutes' => $attributes['minutes'],
        'seconds' => $attributes['seconds'],  
    );

    $countdown_options = json_encode($countdownData);
    
    ob_start();
    ?>

        <div class="<?php echo esc_attr( $class ); ?>" <?php echo (!empty($style) ? 'style="'.esc_attr($style).'"' : '');?>>
            <div class="<?php echo esc_attr( $content_class ); ?>" <?php echo (!empty($content_style) ? 'style="'.esc_attr($content_style).'"' : '');?>>
                <div class="<?php echo esc_attr( $wrapper_class ); ?>" data-countdown-option="<?php echo esc_attr($countdown_options); ?>"></div>
            </div>
        </div>
    
    <?php
    $result = ob_get_clean();
    return $result;
}

register_block_type(
    'getwid/countdown',
    array(
        'attributes' => array(
            'dateTime' => array(
                'type' => 'string',
            ),  
            'year' => array(
                'type' => 'boolean',
                'default' => false,
            ),      
            'months' => array(
                'type' => 'boolean',
                'default' => false,
            ),     
            'weeks' => array(
                'type' => 'boolean',
                'default' => false,
            ),     
            'days' => array(
                'type' => 'boolean',
                'default' => true,
            ),     
            'hours' => array(
                'type' => 'boolean',
                'default' => true,
            ),     
            'minutes' => array(
                'type' => 'boolean',
                'default' => true,
            ),     
            'seconds' => array(
                'type' => 'boolean',
                'default' => true,
            ),     
            'backgroundColor' => array(
                'type' => 'string',
            ),  
            'textColor' => array(
                'type' => 'string',
            ),              
            'customBackgroundColor' => array(
                'type' => 'string',
            ),  
            'customTextColor' => array(
                'type' => 'string',
            ),  

            'fontFamily' => array(
                'type' => 'string',
                'default' => '',
            ),  
            'fontSize' => array(
                'type' => 'string',
            ),  
            'fontSizeTablet' => array(
                'type' => 'string',
                'default' => 'fs-tablet-100',
            ),  
            'fontSizeMobile' => array(
                'type' => 'string',
                'default' => 'fs-mobile-100',
            ),
            'fontWeight' => array(
                'type' => 'string',
            ),
            'fontStyle' => array(
                'type' => 'string',
            ),
            'textTransform' => array(
                'type' => 'string',
            ),
            'lineHeight' => array(
                'type' => 'string',
            ),
            'letterSpacing' => array(
                'type' => 'string',
            ),

            'align' => array(
                'type' => 'string',
            ),
            'textAlignment' => array(
                'type' => 'string',
            ),
            'innerPadding' => array(
                'type' => 'string',
            ),
            'innerSpacings' => array(
                'type' => 'string',
            ),

            'className' => array(
                'type' => 'string',
            ),
        ),        
        'render_callback' => 'render_getwid_countdown',
    )
);