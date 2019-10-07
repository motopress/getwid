<?php

namespace Getwid\Blocks;

class PostCustomField {

    private $block_name = 'getwid/template-post-custom-field';

    public function __construct() {

        register_block_type(
            $this->block_name,
            array(
                'attributes' => array(
                    //Colors
                    'textColor' => array(
                        'type' => 'string'
                    ),
                    'customTextColor' => array(
                        'type' => 'string'
                    ),

                    //Colors
                    'fontSize' => array(
                        'type' => 'string'
                    ),    
                    'customFontSize' => array(
                        'type' => 'number'
                    ),  
                    'customField' => array(
                        'type' => 'string'
                    ),            
                    'bold' => array(
                        'type' => 'boolean',
                        'default' => false
                    ),
                    'italic' => array(
                        'type' => 'boolean',
                        'default' => false
                    ),             
                    'textAlignment' => array(
                        'type' => 'string'
                    ),
                    'className' => array(
                        'type' => 'string'
                    ),             
                ),
                'render_callback' => [ $this, 'render_template_post_custom_field' ]
            )
        );
    }

    public function render_template_post_custom_field( $attributes, $content ) {

        //Not BackEnd render if we view from template page
        if ( (get_post_type() == \Getwid\PostTemplatePart::$postType) || (get_post_type() == 'revision') ){
            return $content;
        }
    
        $block_name = 'wp-block-getwid-template-post-custom-field';
        $wrapper_class = $block_name;
    
        if ( isset( $attributes[ 'className' ] ) ) {
            $wrapper_class .= ' '.esc_attr( $attributes[ 'className' ] );
        }
    
        $wrapper_style = '';
        //Classes
        if ( isset( $attributes[ 'textAlignment' ] ) ) {
            $wrapper_style .= 'text-align: '.esc_attr( $attributes[ 'textAlignment' ] ) . ';';
        }      
        if ( isset( $attributes[ 'bold' ] ) &&  $attributes[ 'bold' ] ) {
            $wrapper_style .= 'font-weight: bold;';
        }
        if ( isset( $attributes[ 'italic' ] ) && $attributes[ 'italic' ] ) {
            $wrapper_style .= 'font-style: italic;';
        }
    
        $is_back_end = \defined( 'REST_REQUEST' ) && REST_REQUEST && ! empty( $_REQUEST['context'] ) && 'edit' === $_REQUEST['context'];
    
        //Link style & class
        if ( isset( $attributes[ 'customFontSize' ] ) ) {
            $wrapper_style .= 'font-size: ' . esc_attr( $attributes[ 'customFontSize' ] ) . 'px;';
        }  
    
        if ( isset( $attributes[ 'fontSize' ] ) ) {
            $wrapper_class .= ' has-' . esc_attr( $attributes[ 'fontSize' ] ) . '-font-size';
        }    
    
        getwid_custom_color_style_and_class($wrapper_style, $wrapper_class, $attributes, 'color', $is_back_end); 
    
        $result = '';
        
        $extra_attr = array(
            'wrapper_class' => $wrapper_class,
            'wrapper_style' => $wrapper_style,
        );
    
        if ( isset( $attributes[ 'customField' ] ) ) {
            ob_start();
            
            getwid_get_template_part( 'template-parts/post-custom-field', $attributes, false, $extra_attr );
    
            $result = ob_get_clean();
        }
    
        return $result;
    }
}

new \Getwid\Blocks\PostCustomField();