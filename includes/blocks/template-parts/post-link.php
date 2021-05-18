<?php

namespace Getwid\Blocks;

class PostLink extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/template-post-link';
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
                    'buttonText' => array(
                        'type' => 'string',
                        'default' => __( 'Read More', 'getwid' )
                    ),
                    'textAlignment' => array(
                        'type' => 'string'
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

        $block_name = 'wp-block-getwid-template-post-link';
        $wrapper_class = $block_name;

        $wrapper_style = '';
        //Classes
        if ( isset( $attributes[ 'className' ] ) ) {
            $wrapper_class .= ' '.esc_attr( $attributes[ 'className' ] );
        }

        if ( isset( $attributes[ 'textAlignment' ] ) ) {
            $wrapper_style .= 'text-align: ' . esc_attr( $attributes[ 'textAlignment' ] ) . ';';
        }

        $is_back_end = \defined( 'REST_REQUEST' ) && REST_REQUEST && ! empty( $_REQUEST[ 'context' ] ) && 'edit' === $_REQUEST[ 'context' ];

        //Link style & class
        getwid_custom_color_style_and_class( $wrapper_style, $wrapper_class, $attributes, 'color', $is_back_end );

        $extra_attr = array(
            'wrapper_class' => $wrapper_class,
            'wrapper_style' => $wrapper_style
        );

        ob_start();

        getwid_get_template_part( 'template-parts/post-link', $attributes, false, $extra_attr );

        $result = ob_get_clean();

		$this->block_frontend_assets();

        return $result;
    }
}

new \Getwid\Blocks\PostLink();
