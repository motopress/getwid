<?php

namespace Getwid\Blocks;

class Countdown extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/countdown';

    public function __construct() {

		parent::__construct( self::$blockName );

		//Set default date + 1 day
		$current_date = new \DateTime(current_time('Y-m-d H:i:s'));
		$current_date->add(new \DateInterval('P1D'));
		$default_date = $current_date->format('Y-m-d H:i:s');

        register_block_type(
            'getwid/countdown',
            array(
				'attributes'      => array(
					'dateTime'        => array(
						'type' => 'string',
						'default' => $default_date,
					),
					'years'           => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'months'          => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'weeks'           => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'days'            => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'hours'           => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'minutes'         => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'seconds'         => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'backgroundColor' => array(
						'type' => 'string',
					),
					'textColor'       => array(
						'type' => 'string',
					),
					'customTextColor' => array(
						'type' => 'string',
					),

					'fontGroupID' =>    array(
						'type'    => 'string',
						'default' => '',
					),
					'fontFamily'     => array(
						'type'    => 'string',
						'default' => '',
					),
					'fontSize'       => array(
						'type' => 'string',
					),
					'fontSizeTablet' => array(
						'type'    => 'string',
						'default' => 'fs-tablet-100',
					),
					'fontSizeMobile' => array(
						'type'    => 'string',
						'default' => 'fs-mobile-100',
					),
					'fontWeight'     => array(
						'type' => 'string',
					),
					'fontStyle'      => array(
						'type' => 'string',
					),
					'textTransform'  => array(
						'type' => 'string',
					),
					'lineHeight'     => array(
						'type' => 'string',
					),
					'letterSpacing'  => array(
						'type' => 'string',
					),

					'align'         => array(
						'type' => 'string',
					),
					'textAlignment' => array(
						'type' => 'string',
					),
					'innerPadding'  => array(
						'type'    => 'string',
						'default' => 'default',
					),
					'innerSpacings' => array(
						'type'    => 'string',
						'default' => 'none',
					),

					'className' => array(
						'type' => 'string',
					),
				),
                'render_callback' => [ $this, 'render_callback' ]
            )
		);

		if ( $this->isEnabled() ) {

			add_filter( 'getwid/editor_blocks_js/dependencies', [ $this, 'block_editor_scripts'] );

			//Register JS/CSS assets
			wp_register_script(
				'jquery-plugin',
				getwid_get_plugin_url( 'vendors/jquery.countdown/jquery.plugin.min.js' ),
				[ 'jquery' ],
				'1.0',
				true
			);

			wp_register_script(
				'jquery-countdown',
				getwid_get_plugin_url( 'vendors/jquery.countdown/jquery.countdown.min.js' ),
				[ 'jquery', 'jquery-plugin' ],
				'2.1.0',
				true
			);

			preg_match( '/^(.*)_/', get_locale(), $current_locale );
			$locale_prefix = isset( $current_locale[ 1 ] ) && $current_locale[ 1 ] !='en' ? $current_locale[ 1 ] : '';

			if ( $locale_prefix != '' ) {
				$locale_path = 'vendors/jquery.countdown/localization/jquery.countdown-' . $locale_prefix . '.js';

				if ( file_exists( getwid_get_plugin_path( $locale_path ) ) ) {
					wp_register_script(
						'jquery-countdown-' . $locale_prefix,
						getwid_get_plugin_url( $locale_path ),
						[ 'jquery-countdown' ],
						'2.1.0',
						true
					);
				}
			}
		}
    }

	public function getLabel() {
		return __('Countdown', 'getwid');
	}

    public function block_editor_scripts($scripts) {

		preg_match( '/^(.*)_/', get_locale(), $current_locale );
		$locale_prefix = isset( $current_locale[ 1 ] ) && $current_locale[ 1 ] !='en' ? $current_locale[ 1 ] : '';

		if ( $locale_prefix != '' ) {
			$locale_path = 'vendors/jquery.countdown/localization/jquery.countdown-' . $locale_prefix . '.js';

			if ( file_exists( getwid_get_plugin_path( $locale_path ) ) ) {
				wp_enqueue_script('jquery-countdown-' . $locale_prefix);
			}
		}

		//jquery.countdown.min.js
        if ( ! in_array( 'jquery-countdown', $scripts ) ) {
            array_push( $scripts, 'jquery-countdown' );
        }

        return $scripts;
    }

    private function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		//jquery.countdown.min.js
		if ( ! wp_script_is( 'jquery-countdown', 'enqueued' ) ) {
			wp_enqueue_script('jquery-countdown');
		}

		preg_match( '/^(.*)_/', get_locale(), $current_locale );
		$locale_prefix = isset( $current_locale[ 1 ] ) && $current_locale[ 1 ] !='en' ? $current_locale[ 1 ] : '';

		if ( $locale_prefix != '' ) {
			$locale_path = 'vendors/jquery.countdown/localization/jquery.countdown-' . $locale_prefix . '.js';

			if ( file_exists( getwid_get_plugin_path( $locale_path ) ) ) {
				wp_enqueue_script('jquery-countdown-' . $locale_prefix);
			}
		}

		if ( FALSE == getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		add_filter( 'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );

		wp_enqueue_style(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/countdown/style.css' ),
			[],
			getwid()->settings()->getVersion()
		);

		wp_enqueue_script(
            self::$blockName,
            getwid_get_plugin_url( 'assets/blocks/countdown/frontend.js' ),
            [ 'jquery', 'jquery-countdown' ],
            getwid()->settings()->getVersion(),
            true
        );

    }

    public function render_callback( $attributes, $content ) {

		if ( isset( $attributes['fontWeight'] ) &&
			( $attributes['fontWeight'] == 'regular' || $attributes['fontWeight'] == 'normal') ) {

			$attributes['fontWeight'] = '400';
		}

		$should_load_gf = $this->shouldLoadGoogleFont( $attributes );

		if ( $should_load_gf ) {

			$fontFamily = $attributes['fontFamily'];

			$fontFamilyHandle = strtolower( preg_replace( '/\s+/', '_', $fontFamily ) );

			$fontWeight = '';
			$fontWeightHandle = '';
			$fontWeightPart = '';
			if ( isset( $attributes['fontWeight'] ) && $attributes['fontWeight'] != '400' ) {
				$fontWeight = $attributes['fontWeight'];
				$fontWeightHandle = '_' . $fontWeight;
				$fontWeightPart = ':' . $fontWeight;
			}

			wp_enqueue_style(
				'google-font-' . esc_attr( $fontFamilyHandle ) . esc_attr( $fontWeightHandle ),
				'https://fonts.googleapis.com/css?family=' . esc_attr( $fontFamily ) . esc_attr( $fontWeightPart ),
				null,
				'all'
			);
		}

		$block_name = 'wp-block-getwid-countdown';
		$class      = $block_name;

		//Classes
		if ( isset( $attributes['className'] ) ) {
			$class .= ' ' . $attributes['className'];
		}
		if ( isset( $attributes['align'] ) ) {
			$class .= ' align' . $attributes['align'];
		}
		if ( isset( $attributes['textAlignment'] ) ) {
			$class .= ' has-horizontal-alignment-' . $attributes['textAlignment'];
		}

		if ( isset( $attributes['innerPadding'] ) && $attributes['innerPadding'] != 'default' ) {
			$class .= ' has-inner-paddings-' . $attributes['innerPadding'];
		}
		if ( isset( $attributes['innerSpacings'] ) && $attributes['innerSpacings'] != 'none' ) {
			$class .= ' has-spacing-' . $attributes['innerSpacings'];
		}

		$wrapper_class = $block_name . '__content';
		$content_class = $block_name . '__wrapper';

		if ( isset( $attributes['fontSizeTablet'] ) && $attributes['fontSizeTablet'] != 'fs-tablet-100' ) {
			$content_class .= ' ' . $attributes['fontSizeTablet'];
		}
		if ( isset( $attributes['fontSizeMobile'] ) && $attributes['fontSizeMobile'] != 'fs-mobile-100' ) {
			$content_class .= ' ' . $attributes['fontSizeMobile'];
		}
		if ( isset( $attributes['fontSize'] ) && $attributes['fontSize'] != '' ) {
			$content_class .= ' has-custom-font-size';
		}

		$content_style = '';
		//Style
		if ( isset( $attributes['fontSize'] ) ) {
			$content_style .= 'font-size: ' . $attributes['fontSize'] . ';';
		}

		if ( isset( $attributes['fontFamily'] ) && $attributes['fontFamily'] != '' ) {
			$content_style .= 'font-family: ' . $attributes['fontFamily'] . ';';
		}
		if ( isset( $attributes['fontWeight'] ) ) {
			$content_style .= 'font-weight: ' . $attributes['fontWeight'] . ';';
		}
		if ( isset( $attributes['fontStyle'] ) ) {
			$content_style .= 'font-style: ' . $attributes['fontStyle'] . ';';
		}
		if ( isset( $attributes['textTransform'] ) && $attributes['textTransform'] != 'default' ) {
			$content_style .= 'text-transform: ' . $attributes['textTransform'] . ';';
		}
		if ( isset( $attributes['lineHeight'] ) ) {
			$content_style .= 'line-height: ' . $attributes['lineHeight'] . ';';
		}
		if ( isset( $attributes['letterSpacing'] ) ) {
			$content_style .= 'letter-spacing: ' . $attributes['letterSpacing'] . ';';
		}

		$is_back_end = getwid_is_block_editor();

		//Color style & class
		getwid_custom_color_style_and_class( $content_style, $content_class, $attributes, 'color', $is_back_end );

		try {
			$target_date = new \DateTime( $attributes['dateTime'] );
		} catch ( Exception $e ) {
			return esc_html__( 'Invalid date.', 'getwid' );
		}

		$current_date = new \DateTime(current_time('Y-m-d H:i:s')); //Server time

		if ( $current_date < $target_date ) {
			$dateTime_until = $current_date->diff( $target_date )->format( "+%yy +%mo +%dd +%hh +%im +%ss" );
		} else {
			$dateTime_until = 'negative';
		}

		$countdown_options = array(
			( ! empty( $attributes['backgroundColor'] ) ? 'data-bg-color="' . esc_attr( $attributes['backgroundColor'] ) . '"' : '' ),
			( ! empty( $attributes['years'] ) ? 'data-years="' . esc_attr( $attributes['years'] ) . '"' : '' ),
			( ! empty( $attributes['months'] ) ? 'data-months="' . esc_attr( $attributes['months'] ) . '"' : '' ),
			( ! empty( $attributes['weeks'] ) ? 'data-weeks="' . esc_attr( $attributes['weeks'] ) . '"' : '' ),
			( ! empty( $attributes['days'] ) ? 'data-days="' . esc_attr( $attributes['days'] ) . '"' : '' ),
			( ! empty( $attributes['hours'] ) ? 'data-hours="' . esc_attr( $attributes['hours'] ) . '"' : '' ),
			( ! empty( $attributes['minutes'] ) ? 'data-minutes="' . esc_attr( $attributes['minutes'] ) . '"' : '' ),
			( ! empty( $attributes['seconds'] ) ? 'data-seconds="' . esc_attr( $attributes['seconds'] ) . '"' : '' ),
		);

		$countdown_options_str = implode( ' ', $countdown_options );

		ob_start();
		?>

		<div class="<?php echo esc_attr( $class ); ?>">
			<div class="<?php echo esc_attr( $content_class ); ?>" <?php if ( ! empty( $content_style ) ) { ?> style="<?php echo esc_attr( $content_style ); ?>"<?php } ?>>
				<div class="<?php echo esc_attr( $wrapper_class ); ?>"
					 data-datetime="<?php echo esc_attr( !empty( $dateTime_until ) ? $dateTime_until : '' ); ?>" <?php echo $countdown_options_str; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
				</div>
			</div>
		</div>

		<?php
		$result = ob_get_clean();

		$this->block_frontend_assets();

		return $result;
    }

	private function shouldLoadGoogleFont( $attributes ) {
		$should_load = false;

		// if fontFamily set maybe GF should be loaded
		if ( isset( $attributes['fontFamily'] ) && !empty( $attributes['fontFamily'] ) ) {
			$should_load = true;
		}

		// if fontFamily isset (condition above) check fontGroupID
		// if fontGroupID isset but not equal to 'google-fonts' or ''(for old plugin versions) it shouldn't be loaded
		if ( $should_load && isset( $attributes['fontGroupID'] ) && !in_array( $attributes['fontGroupID'], ['', 'google-fonts'] ) ) {
			$should_load = false;
		}

		return $should_load;
	}
}

getwid()->blocksManager()->addBlock(
	new \Getwid\Blocks\Countdown()
);
