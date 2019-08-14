<?php

function render_getwid_countdown( $attributes, $content ) {













    return $content;
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