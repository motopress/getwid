<?php

namespace Getwid\Blocks;

class PostTitle extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/template-post-title';
	protected static $assetsHandle = 'getwid/template-parts';

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
                    'linkTo' => array(
                        'type' => 'string',
                        'default' => 'none'
                    ),
                    'fontSize' => array(
                        'type' => 'string'
                    ),
                    'customFontSize' => array(
                        'type' => 'number'
                    ),
                    'bold' => array(
                        'type' => 'boolean'
                    ),
                    'italic' => array(
                        'type' => 'boolean',
                        'default' => false
                    ),
                    'textAlignment' => array(
                        'type' => 'string'
                    ),
                    'headerTag' => array(
                        'type' => 'string',
                        'default' => 'h2'
                    ),

                    'className' => array(
                        'type' => 'string'
                    )
                ),
                'render_callback' => [ $this, 'render_callback' ]
            )
        );
    }

    private function block_frontend_assets() {

        if ( is_admin() ) {
            return;
        }

		if ( FALSE == getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		add_filter( 'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = self::$assetsHandle;

				return $assets;
			}
		);

		wp_enqueue_style(
			self::$assetsHandle,
			getwid_get_plugin_url( 'assets/blocks/template-parts/style.css' ),
			[],
			getwid()->settings()->getVersion()
		);
    }

    public function render_callback( $attributes, $content ) {

        //Not BackEnd render if we view from template page
        if ( ( get_post_type() == getwid()->postTemplatePart()->postType ) || ( get_post_type() == 'revision' ) ) {
            return $content;
        }

        $block_name = 'wp-block-getwid-template-post-title';
        //Link style & class
        $title_style = '';
        $title_class = $block_name;

        //Classes
        if ( isset( $attributes[ 'className' ] ) ) {
            $title_class .= ' '.esc_attr( $attributes[ 'className' ] );
        }

        if ( isset( $attributes[ 'textAlignment' ] ) ) {
            $title_style .= 'text-align: ' . esc_attr( $attributes[ 'textAlignment' ] ) . ';';
        }

        $is_back_end = getwid_is_block_editor();


        $link_class = esc_attr( $block_name ) . '__link';

        if ( isset( $attributes[ 'bold' ] ) && $attributes[ 'bold' ] ) {
            $title_style .= 'font-weight: bold;';
        }

        if ( isset( $attributes[ 'italic' ] ) && $attributes[ 'italic' ] ) {
            $title_style .= 'font-style: italic;';
        }

        if ( isset( $attributes[ 'customFontSize' ] ) ) {
            $title_style .= 'font-size: ' . esc_attr( $attributes[ 'customFontSize' ] ) . 'px;';
        }

        if ( isset( $attributes[ 'fontSize' ] ) ) {
            $title_class .= ' has-'.esc_attr( $attributes[ 'fontSize' ] ) . '-font-size';
        }

        getwid_custom_color_style_and_class( $title_style, $title_class, $attributes, 'color', $is_back_end );

        $result = '';
        $headerTag = $attributes[ 'headerTag' ];

        $extra_attr = array(
            'headerTag'   => $headerTag,
            'title_style' => $title_style,
            'title_class' => $title_class,
            'link_class'  => $link_class
        );

        if ( get_the_title() ) {
            ob_start();

            getwid_get_template_part( 'template-parts/post-title', $attributes, false, $extra_attr );

            $result = ob_get_clean();
        }

		$this->block_frontend_assets();

        return $result;
    }
}

new \Getwid\Blocks\PostTitle();
