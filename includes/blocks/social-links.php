<?php

namespace Getwid\Blocks;

class SocialLinks {

    private $blockName = 'getwid/social-links';

    public function __construct() {

        add_filter( 'getwid/editor_blocks_css/dependencies', [ $this, 'block_editor_styles' ] );

        register_block_type(
            $this->blockName
        );

        wp_register_style(
            'fonticonpicker-base-theme',
            getwid_get_plugin_url('vendors/fonticonpicker/react-fonticonpicker/dist/fonticonpicker.base-theme.react.css'),
            null,
            '1.2.0'
        );

        wp_register_style(
            'fonticonpicker-react-theme',
            getwid_get_plugin_url('vendors/fonticonpicker/react-fonticonpicker/dist/fonticonpicker.material-theme.react.css'),
            null,
            '1.2.0'
        );
    }
    
    public function block_editor_styles($styles) {

		//fonticonpicker.base-theme.react.css
        if ( ! in_array( 'fonticonpicker-base-theme', $styles ) ) {
            array_push( $styles, 'fonticonpicker-base-theme' );
        }

		//fonticonpicker.material-theme.react.css
        if ( ! in_array( 'fonticonpicker-react-theme', $styles ) ) {
            array_push( $styles, 'fonticonpicker-react-theme' );
        }

        return $styles;
    }
}

new \Getwid\Blocks\SocialLinks();