<?php

namespace Getwid\Blocks\New;

class PostCarousel extends AbstractBlock {

	private $assets_already_enqueued = false;

	public function __construct() {

		parent::__construct( 'getwid/post-carousel' );

		wp_register_script(
			'slick',
			getwid_get_plugin_url( 'vendors/slick/slick/slick.min.js' ),
			array( 'jquery' ),
			'1.9.0',
			true
		);

		wp_register_style(
			'slick',
			getwid_get_plugin_url( 'vendors/slick/slick/slick.min.css' ),
			array(),
			'1.9.0'
		);

		wp_register_style(
			'slick-theme',
			getwid_get_plugin_url( 'vendors/slick/slick/slick-theme.min.css' ),
			array(),
			'1.9.0'
		);

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/post-carousel' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);

		if ( $this->is_enabled() ) {
			add_filter( 'getwid/editor_blocks_js/dependencies', array( $this, 'block_editor_scripts' ) );
			add_filter( 'getwid/blocks_style_css/dependencies', array( $this, 'block_frontend_styles' ) );
		}
	}

	public function get_label() {
		return __( 'Post Carousel', 'getwid' );
	}

	public function block_editor_scripts( $scripts ) {

		if ( ! in_array( 'imagesloaded', $scripts, true ) ) {
			$scripts[] = 'imagesloaded';
		}

		if ( ! in_array( 'slick', $scripts, true ) ) {
			$scripts[] = 'slick';
		}

		return $scripts;
	}

	public function block_frontend_styles( $styles ) {

		$styles = getwid()->fontIconsManager()->enqueueFonts( $styles );

		if ( ! in_array( 'slick', $styles, true ) ) {
			$styles[] = 'slick';
		}

		if ( ! in_array( 'slick-theme', $styles, true ) ) {
			$styles[] = 'slick-theme';
		}

		return $styles;
	}

	public function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		wp_enqueue_script( 'slick' );
		wp_enqueue_script( 'imagesloaded' );

		if ( false === getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		$deps = array(
			'slick',
			'slick-theme',
		);

		$deps = getwid()->fontIconsManager()->enqueueFonts( $deps );

		add_filter(
			'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = 'slick';
				$assets[] = 'slick-theme';
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		wp_enqueue_style( 'slick' );
		wp_enqueue_style( 'slick-theme' );

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );

		if ( ! $this->assets_already_enqueued ) {
			$inline_script  = 'var Getwid = Getwid || {};';
			$inline_script .= 'Getwid["isRTL"] = ' . wp_json_encode( is_rtl() ) . ';';

			wp_add_inline_script(
				'getwid-post-carousel-view-script',
				$inline_script,
				'before'
			);
		}

		$this->assets_already_enqueued = true;
	}

	public function render_callback( $attributes, $content ) {

		$query_args = getwid_build_custom_post_type_query( $attributes );
		$q          = new \WP_Query( $query_args );

		$use_template          = false;
		$template_part_content = '';

		if ( isset( $attributes['postTemplate'] ) && '' !== $attributes['postTemplate'] ) {
			$template_post = get_post( $attributes['postTemplate'], ARRAY_A );

			if ( ! is_null( $template_post ) && '' !== $template_post['post_content'] ) {
				$use_template          = true;
				$template_part_content = $template_post['post_content'];
			}
		}

		$block_name = 'wp-block-getwid-post-carousel';
		$post_type  = isset( $attributes['postType'] ) ? $attributes['postType'] : 'post';

		$extra_attr = array(
			'block_name' => $block_name,
		);

		$class  = $block_name;
		$class .= ' custom-post-type-' . $post_type;

		if ( isset( $attributes['align'] ) ) {
			$class .= ' align' . $attributes['align'];
		}
		if ( isset( $attributes['showPostDate'] ) && $attributes['showPostDate'] ) {
			$class .= ' has-dates';
		}
		if ( isset( $attributes['className'] ) ) {
			$class .= ' ' . $attributes['className'];
		}

		$wrapper_class = $block_name . '__wrapper';

		if ( isset( $attributes['sliderSlidesToShowDesktop'] ) && $attributes['sliderSlidesToShowDesktop'] > 1 ) {
			$class .= ' has-slides-gap-' . $attributes['sliderSpacing'];
			$class .= ' is-carousel';
		}

		$class .= ' has-arrows-' . $attributes['sliderArrows'];
		$class .= ' has-dots-' . $attributes['sliderDots'];

		$slider_data = array(
			'sliderSlidesToShowDesktop' => $attributes['sliderSlidesToShowDesktop'],
			'getwid_slidesToShowLaptop' => $attributes['sliderSlidesToShowLaptop'],
			'getwid_slidesToShowTablet' => $attributes['sliderSlidesToShowTablet'],
			'getwid_slidesToShowMobile' => $attributes['sliderSlidesToShowMobile'],
			'getwid_autoplay_speed'     => intval( $attributes['sliderAutoplaySpeed'] ),
			'getwid_animation_speed'    => intval( $attributes['sliderAnimationSpeed'] ),
			'getwid_slidesToScroll'     => $attributes['sliderSlidesToScroll'],
			'getwid_autoplay'           => $attributes['sliderAutoplay'],
			'getwid_pause_on_hover'     => $attributes['sliderPauseOnHover'],
			'getwid_infinite'           => $attributes['sliderInfinite'],
			'getwid_center_mode'        => $attributes['sliderCenterMode'],
			'getwid_arrows'             => $attributes['sliderArrows'],
			'getwid_dots'               => $attributes['sliderDots'],
		);

		$slider_options = wp_json_encode( $slider_data );

		ob_start();
		?>
		<div class="<?php echo esc_attr( $class ); ?>">
			<div data-slider-option="<?php echo esc_attr( $slider_options ); ?>" class="<?php echo esc_attr( $wrapper_class ); ?>">
				<?php
				if ( ! $use_template ) {
					$template = $post_type;
					$located  = getwid_locate_template( 'post-carousel/' . $post_type );
					if ( ! $located ) {
						$template = 'post';
					}
				}

				if ( $q->have_posts() ) {
					while ( $q->have_posts() ) :
						$q->the_post();
						?>
						<div class="<?php echo esc_attr( $block_name ); ?>__slide">
							<?php
							if ( $use_template ) {
								echo do_blocks( $template_part_content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							} else {
								getwid_get_template_part( 'post-carousel/' . $template, $attributes, false, $extra_attr );
							}
							?>
						</div>
						<?php
					endwhile;

					wp_reset_postdata();
				} else {
					do_action( 'getwid/blocks/post-carousel/no-items', $attributes, $content );
				}
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
	new PostCarousel()
);
