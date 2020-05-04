<?php

namespace Getwid\Blocks;

class AdvancedHeading extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/advanced-heading';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            'getwid/advanced-heading',
            array(
                'render_callback' => [ $this, 'render_callback' ]
            )
        );
    }

	public function getLabel() {
		return __('Advanced Heading', 'getwid');
	}

    public function render_callback( $attributes, $content ) {

        if ( isset( $attributes['fontWeight'] ) && $attributes['fontWeight'] == 'regular') {
            $attributes['fontWeight'] = '400';
        }

        if ( isset( $attributes['fontFamily'] ) ) {
            wp_enqueue_style(
                "google-font-".esc_attr(strtolower(preg_replace('/\s+/', '_', $attributes['fontFamily']))).(isset( $attributes['fontWeight'] ) && $attributes['fontWeight'] != '400' ? "_".esc_attr($attributes['fontWeight']) : ""),
                "https://fonts.googleapis.com/css?family=".esc_attr($attributes['fontFamily']).(isset( $attributes['fontWeight'] ) && $attributes['fontWeight'] != '400' ? ":".esc_attr($attributes['fontWeight']) : ""),
                null,
                'all'
            );
        }
        return $content;
    }
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\AdvancedHeading()
);
