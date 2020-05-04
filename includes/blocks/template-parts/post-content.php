<?php

namespace Getwid\Blocks;

class PostContent extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/template-post-content';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            self::$blockName,
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
                    'textAlignment' => array(
                        'type' => 'string'
                    ),
                    'showContent' => array(
                        'type' => 'string',
                        'default' => 'excerpt'
                    ),
                    'contentLength' => array(
                        'type' => 'number',
                        'default' => apply_filters( 'excerpt_length', 55 )
                    ),
                    'className' => array(
                        'type' => 'string'
                    )
                ),
                'render_callback' => [ $this, 'render_callback' ],
            )
        );
    }

    public function render_callback( $attributes, $content ) {

        //Not BackEnd render if we view from template page
        if ( ( get_post_type() == getwid()->postTemplatePart()->postType ) || ( get_post_type() == 'revision' ) ) {
            return $content;
        }

        $block_name = 'wp-block-getwid-template-post-content';
        $wrapper_class = $block_name;

        if ( isset( $attributes[ 'className' ] ) ) {
            $wrapper_class .= ' '.esc_attr( $attributes[ 'className' ] );
        }

        if ( isset( $attributes[ 'showContent' ] ) ) {
            $wrapper_class .= ' is-'.esc_attr( $attributes[ 'showContent' ] );
        }

        $wrapper_style = '';
        //Classes
        if ( isset( $attributes[ 'textAlignment' ] ) ) {
            $wrapper_style .= 'text-align: ' . esc_attr( $attributes[ 'textAlignment' ] ) . ';';
        }

        if ( isset( $attributes[ 'customFontSize' ] ) ) {
            $wrapper_style .= 'font-size: '.esc_attr( $attributes[ 'customFontSize' ] ) . 'px';
        }

        if ( isset( $attributes[ 'fontSize' ] ) ) {
            $wrapper_class .= ' has-' . esc_attr( $attributes[ 'fontSize' ] ) . '-font-size';
        }

        $contentLength = isset( $attributes['contentLength'] ) ? $attributes[ 'contentLength' ] : false;

        $current_post = get_post( get_the_ID() );

        $is_back_end = \defined( 'REST_REQUEST' ) && REST_REQUEST && ! empty( $_REQUEST[ 'context' ] ) && 'edit' === $_REQUEST[ 'context' ];

        //Link style & class
        getwid_custom_color_style_and_class( $wrapper_style, $wrapper_class, $attributes, 'color', $is_back_end );

        $extra_attr = array(
            'wrapper_class' => $wrapper_class,
            'wrapper_style' => $wrapper_style,
            'contentLength' => $contentLength,
            'current_post' => $current_post
        );

        ob_start();

        getwid_get_template_part( 'template-parts/post-content', $attributes, false, $extra_attr );

        $result = ob_get_clean();

        return $result;
    }
}

new \Getwid\Blocks\PostContent();
