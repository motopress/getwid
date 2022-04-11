<?php

namespace Getwid\Blocks;

class PostSlider extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/post-slider';

    public function __construct() {

		parent::__construct( self::$blockName );

        /* #region Register block */
        register_block_type(
            'getwid/post-slider',
            array(
                'attributes' => array(
                    'postTemplate' => array(
                        'type' => 'string',
                    ),

                    //Custom Post Type
                    'postsToShow' => array(
                        'type' => 'number',
                        'default' => 5,
					),
                    'offset' => array(
                        'type' => 'number',
                        'default' => 0
                    ),
                    'ignoreSticky' => array(
                        'type' => 'boolean',
                        'default' => true,
                    ),
                    'filterById' => array(
                        'type' => 'string',
					),
                    'excludeById' => array(
                        'type' => 'string'
					),
                    'excludeCurrentPost' => array(
                        'type' => 'boolean',
                        'default' => false
					),
					'childPagesCurrentPage' => array(
                        'type' => 'boolean',
                        'default' => false
                    ),
                    'parentPageId' => array(
                        'type' => 'string',
                    ),
                    'postType' => array(
                        'type' => 'string',
                        'default' => 'post',
                    ),
                    'taxonomy' => array(
                        'type' => 'array',
                        'items'   => [
                            'type' => 'string',
                        ],
                    ),
                    'terms' => array(
                        'type' => 'array',
                        'items'   => [
                            'type' => 'string',
                        ],
                    ),
                    'relation' => array(
                        'type' => 'string',
                        'default' => 'AND',
                    ),
                    'order' => array(
                        'type' => 'string',
                        'default' => 'desc',
                    ),
                    'orderBy' => array(
                        'type' => 'string',
                        'default' => 'date',
                    ),
                    //Custom Post Type

                    //Content
                    'minHeight' => array(
                        'type' => 'string',
                    ),

                    //Posts
                    'align' => array(
                        'type' => 'string',
                    ),
                    'textAlignment' => array(
                        'type' => 'string',
                        'default' => 'left',
                    ),

                    //Slider
                    'sliderAnimationEffect' => array(
                        'type' => 'string',
                        'default' => 'slide'
                    ),
                    'sliderAutoplay' => array(
                        'type' => 'boolean',
                        'default' => false
                    ),
                    'sliderAutoplaySpeed' => array(
                        'type' => 'string',
                        'default' => '6000'
                    ),
                    'sliderInfinite' => array(
                        'type' => 'boolean',
                        'default' => true
                    ),
                    'sliderAnimationSpeed' => array(
                        'type' => 'string',
                        'default' => '800'
                    ),
                    'sliderArrows' => array(
                        'type' => 'string',
                        'default' => 'inside'
                    ),
                    'sliderDots' => array(
                        'type' => 'string',
                        'default' => 'inside'
                    ),

                    'className' => array(
                        'type' => 'string',
                    ),

                    //Modal
					'metaQuery' => array(
						'type' => 'array',
						'default' => []
					),
                ),
                'render_callback' => [ $this, 'render_callback' ]
            )
        );
        /* #endregion */

		if ( $this->isEnabled() ) {

			add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );
			add_filter( 'getwid/blocks_style_css/dependencies', [ $this, 'block_frontend_styles' ] );

			//Register JS/CSS assets
			wp_register_script(
				'slick',
				getwid_get_plugin_url( 'vendors/slick/slick/slick.min.js' ),
				[ 'jquery' ],
				'1.9.0',
				true
			);

			wp_register_style(
				'slick',
				getwid_get_plugin_url( 'vendors/slick/slick/slick.min.css' ),
				[],
				'1.9.0'
			);

			wp_register_style(
				'slick-theme',
				getwid_get_plugin_url( 'vendors/slick/slick/slick-theme.min.css' ),
				[],
				'1.9.0'
			);
		}
    }

	public function getLabel() {
		return __('Post Slider', 'getwid');
	}

    public function block_editor_scripts($scripts) {

        //imagesloaded.min.js
		if ( ! in_array( 'imagesloaded', $scripts ) ) {
            array_push( $scripts, 'imagesloaded' );
		}

		//slick.min.js
        if ( ! in_array( 'slick', $scripts ) ) {
            array_push( $scripts, 'slick' );
        }

        return $scripts;
    }

    public function block_frontend_styles($styles) {

		//fontawesome
		// for /template-parts/*
		$styles = getwid()->fontIconsManager()->enqueueFonts( $styles );

		//slick.min.css
        if ( ! in_array( 'slick', $styles ) ) {
            array_push( $styles, 'slick' );
        }

		//slick-theme.min.css
        if ( ! in_array( 'slick-theme', $styles ) ) {
            array_push( $styles, 'slick-theme' );
        }

        return $styles;
    }

    private function block_frontend_assets() {

		if ( is_admin() ) {
            return;
        }

		//slick.min.js
        if ( ! wp_script_is( 'slick', 'enqueued' ) ) {
            wp_enqueue_script('slick');
        }

        //imagesloaded.min.js
		if ( ! wp_script_is( 'imagesloaded', 'enqueued' ) ) {
			wp_enqueue_script('imagesloaded');
		}

		if ( FALSE == getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		$deps = [
			'slick', 'slick-theme'
		];

		//fontawesome
		// for /template-parts/*
		$deps = getwid()->fontIconsManager()->enqueueFonts( $deps );

		add_filter( 'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = 'slick';
				$assets[] = 'slick-theme';
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );

		wp_enqueue_style(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/post-slider/style.css' ),
			$deps,
			getwid()->settings()->getVersion()
		);

		wp_enqueue_script(
            self::$blockName,
            getwid_get_plugin_url( 'assets/blocks/post-slider/frontend.js' ),
            [ 'jquery', 'imagesloaded', 'slick' ],
            getwid()->settings()->getVersion(),
            true
        );

    }

    public function render_callback( $attributes, $content ) {

        //Custom Post Type
        $query_args = getwid_build_custom_post_type_query( $attributes );

        $q = new \WP_Query( $query_args );
        //Custom Post Type

        //Custom Template
        $use_template = false;
        $template_part_content = '';

        if ( isset( $attributes['postTemplate'] ) && $attributes['postTemplate'] != '' ) {

            $template_post = get_post($attributes['postTemplate'], ARRAY_A);

            //If post exist and content not empty
            if (!is_null($template_post) && $template_post['post_content'] != ''){
                $use_template = true;
                $template_part_content = $template_post['post_content'];
            }
        }

        $block_name = 'wp-block-getwid-post-slider';

        $post_type =  isset($attributes['postType']) ? $attributes['postType'] : 'post';

        $extra_attr = array(
            'block_name' => $block_name,
            'back_end' => getwid_is_block_editor()
        );

        $class = $block_name;
        $class .= ' custom-post-type-' . $post_type;

        if ( isset( $attributes['align'] ) ) {
            $class .= ' align' . $attributes['align'];
        }
        if ( isset( $attributes['className'] ) ) {
            $class .= ' ' . $attributes['className'];
        }

        $content_class = $block_name . '__content';

        $slide_style = '';

        if ( isset( $attributes['minHeight'] ) ) {
            $slide_style .= 'min-height:' . $attributes['minHeight'] . ';';
        }

        $class .= ' has-arrows-' . $attributes['sliderArrows'];
        $class .= ' has-dots-' . $attributes['sliderDots'];

        $sliderData = array(
            'getwid_fade_effect' => $attributes['sliderAnimationEffect'],
            'getwid_autoplay' => $attributes['sliderAutoplay'],
            'getwid_autoplay_speed' => intval($attributes['sliderAutoplaySpeed']),
            'getwid_infinite' => $attributes['sliderInfinite'],
            'getwid_animation_speed' => intval($attributes['sliderAnimationSpeed']),
            'getwid_arrows' => $attributes['sliderArrows'],
            'getwid_dots' => $attributes['sliderDots'],
        );

        $slider_options = json_encode($sliderData);

        ob_start();

        ?>

        <div class="<?php echo esc_attr( $class ); ?>">
            <div data-slider-option="<?php echo esc_attr( $slider_options ); ?>" class="<?php echo esc_attr( $content_class );?>">
                <?php

                if ( !$use_template ) {
                    $template = $post_type;
                    $located = getwid_locate_template( 'post-slider/' . $post_type );
                    if ( ! $located ) {
                        $template = 'post';
                    }
                }

                if ( $q->have_posts() ):
                    ob_start();

                    while( $q->have_posts() ):
                        $q->the_post();

						?>
							<div class="<?php echo esc_attr($block_name);?>__slide" style="<?php echo esc_attr( $slide_style ); ?>">
								<?php
									if ($use_template){
										echo do_blocks( $template_part_content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									} else {
										getwid_get_template_part('post-slider/' . $template, $attributes, false, $extra_attr);
									}
								?>
							</div>
						<?php

                    endwhile;

                    wp_reset_postdata();
                    ob_end_flush();
                else:
					do_action( 'getwid/blocks/post-slider/no-items', $attributes, $content );
                endif;
                ?>
            </div>
        </div>
        <?php

        $result = ob_get_clean();

        $this->block_frontend_assets();

        return $result;
    }
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\PostSlider()
);
