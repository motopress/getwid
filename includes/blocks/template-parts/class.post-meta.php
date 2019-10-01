<?php

namespace Getwid\Blocks;

class PostMeta {

    private $block_name = 'getwid/template-post-meta';

    public function __construct() {

        register_block_type(
            $this->block_name,
            array(
                'attributes' => array(
                    'blockDivider' => array(
                        'type' => 'string'
                    ),      
                    
                    //Colors
                    'textColor' => array(
                        'type' => 'string'
                    ),
                    'customTextColor' => array(
                        'type' => 'string'
                    ),

                    //Colors
                    'direction' => array(
                        'type' => 'string',
                        'default' => 'row'
                    ),            
                    'textAlignment' => array(
                        'type' => 'string'
                    ),
        
                    'className' => array(
                        'type' => 'string'
                    )
                ),
                'render_callback' => [ $this, 'render_template_post_meta' ]
            )
        );
    }

    public function render_template_post_meta( $attributes, $content ) {
        //Not BackEnd render if we view from template page
        if ( ( get_post_type() == \Getwid\PostTemplatePart::$postType ) || ( get_post_type() == 'revision' ) ) {
            return $content;
        }
    
        $block_name = 'wp-block-getwid-template-post-meta';
        $wrapper_class = $block_name;
    
        $wrapper_style = '';
        //Classes
        if ( isset( $attributes[ 'className' ] ) ) {
            $wrapper_class .= ' '.esc_attr( $attributes[ 'className' ] );
        }
    
        if ( isset( $attributes[ 'direction' ] ) ) {
            $wrapper_class .= ' has-direction-' . esc_attr( $attributes[ 'direction' ] );
        }    
        if ( isset( $attributes[ 'textAlignment' ] ) ) {
            if ( $attributes[ 'direction' ] == 'row' ) {
                $wrapper_class .= ' has-alignment-' . esc_attr( $attributes[ 'textAlignment' ] );
            } else {
                $wrapper_style .= 'text-align: ' . esc_attr( $attributes[ 'textAlignment' ] ) . ';';
            }
        }      
    
        $is_back_end = \defined( 'REST_REQUEST' ) && REST_REQUEST && ! empty( $_REQUEST[ 'context' ] ) && 'edit' === $_REQUEST[ 'context' ];
    
        getwid_custom_color_style_and_class( $wrapper_style, $wrapper_class, $attributes, 'color', $is_back_end ); 
    
        $result = '';
    
        $extra_attr = array(
            'wrapper_class' => $wrapper_class,
            'wrapper_style' => $wrapper_style,
            'content' => $content
        );
    
        if ( strlen( $content ) ) {
            ob_start();
            
            getwid_get_template_part( 'template-parts/post-meta', $attributes, false, $extra_attr );
    
            $result = ob_get_clean();
        }
    
        return $result;
    }
}

new \Getwid\Blocks\PostMeta();