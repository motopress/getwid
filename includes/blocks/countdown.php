<?php

namespace Getwid\Blocks\New;

class Countdown extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/countdown' );

		$this->register_vendor_scripts();

		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/countdown' ),
			array(
				'attributes'      => $this->get_block_attributes(),
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Countdown', 'getwid' );
	}

	private function get_default_date() {

		$current_date = new \DateTime( current_time( 'Y-m-d H:i:s' ) );
		$current_date->add( new \DateInterval( 'P1D' ) );

		return $current_date->format( 'Y-m-d H:i:s' );
	}

	private function get_block_attributes() {

		return array(
			'dateTime'        => array(
				'type'    => 'string',
				'default' => $this->get_default_date(),
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
			'fontGroupID'     => array(
				'type'    => 'string',
				'default' => '',
			),
			'fontFamily'      => array(
				'type'    => 'string',
				'default' => '',
			),
			'fontSize'        => array(
				'type' => 'string',
			),
			'fontSizeTablet'  => array(
				'type'    => 'string',
				'default' => 'fs-tablet-100',
			),
			'fontSizeMobile'  => array(
				'type'    => 'string',
				'default' => 'fs-mobile-100',
			),
			'fontWeight'      => array(
				'type' => 'string',
			),
			'fontStyle'       => array(
				'type' => 'string',
			),
			'textTransform'   => array(
				'type' => 'string',
			),
			'lineHeight'      => array(
				'type' => 'string',
			),
			'letterSpacing'   => array(
				'type' => 'string',
			),
			'align'           => array(
				'type' => 'string',
			),
			'textAlignment'   => array(
				'type' => 'string',
			),
			'innerPadding'    => array(
				'type'    => 'string',
				'default' => 'default',
			),
			'innerSpacings'   => array(
				'type'    => 'string',
				'default' => 'none',
			),
			'className'       => array(
				'type' => 'string',
			),
		);
	}

	private function get_locale_prefix() {

		preg_match( '/^(.*)_/', get_locale(), $current_locale );

		return isset( $current_locale[1] ) && 'en' !== $current_locale[1] ? $current_locale[1] : '';
	}

	private function register_vendor_scripts() {

		wp_register_script(
			'jquery-plugin',
			getwid_get_plugin_url( 'vendors/jquery.countdown/jquery.plugin.min.js' ),
			array( 'jquery' ),
			'1.0',
			true
		);

		wp_register_script(
			'jquery-countdown',
			getwid_get_plugin_url( 'vendors/jquery.countdown/jquery.countdown.min.js' ),
			array( 'jquery', 'jquery-plugin' ),
			'2.1.0',
			true
		);

		$locale_prefix = $this->get_locale_prefix();

		if ( '' !== $locale_prefix ) {
			$locale_path = 'vendors/jquery.countdown/localization/jquery.countdown-' . $locale_prefix . '.js';

			if ( file_exists( getwid_get_plugin_path( $locale_path ) ) ) {
				wp_register_script(
					'jquery-countdown-' . $locale_prefix,
					getwid_get_plugin_url( $locale_path ),
					array( 'jquery-countdown' ),
					'2.1.0',
					true
				);
			}
		}
	}

	public function enqueue_editor_assets() {

		wp_enqueue_script( 'jquery-countdown' );

		$locale_prefix = $this->get_locale_prefix();

		if ( '' !== $locale_prefix ) {
			$locale_path = 'vendors/jquery.countdown/localization/jquery.countdown-' . $locale_prefix . '.js';

			if ( file_exists( getwid_get_plugin_path( $locale_path ) ) ) {
				wp_enqueue_script( 'jquery-countdown-' . $locale_prefix );
			}
		}
	}

	public function block_frontend_assets() {

		if ( is_admin() ) {
			return;
		}

		wp_enqueue_script( 'jquery-countdown' );

		$locale_prefix = $this->get_locale_prefix();

		if ( '' !== $locale_prefix ) {
			$locale_path = 'vendors/jquery.countdown/localization/jquery.countdown-' . $locale_prefix . '.js';

			if ( file_exists( getwid_get_plugin_path( $locale_path ) ) ) {
				wp_enqueue_script( 'jquery-countdown-' . $locale_prefix );
			}
		}

		if ( false === getwid()->assetsOptimization()->load_assets_on_demand() ) {
			return;
		}

		add_filter(
			'getwid/optimize/assets',
			function ( $assets ) {
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );
	}

	public function render_callback( $attributes, $content ) {

		$attributes = wp_parse_args(
			$attributes,
			array(
				'dateTime'       => $this->get_default_date(),
				'years'          => false,
				'months'         => false,
				'weeks'          => false,
				'days'           => true,
				'hours'          => true,
				'minutes'        => true,
				'seconds'        => true,
				'fontGroupID'    => '',
				'fontFamily'     => '',
				'fontSizeTablet' => 'fs-tablet-100',
				'fontSizeMobile' => 'fs-mobile-100',
				'innerPadding'   => 'default',
				'innerSpacings'  => 'none',
			)
		);

		if (
			isset( $attributes['fontWeight'] ) &&
			( 'regular' === $attributes['fontWeight'] || 'normal' === $attributes['fontWeight'] )
		) {
			$attributes['fontWeight'] = '400';
		}

		if ( $this->should_load_google_font( $attributes ) ) {
			$font_family        = $attributes['fontFamily'];
			$font_family_handle = strtolower( preg_replace( '/\s+/', '_', $font_family ) );
			$font_weight        = '';
			$font_weight_handle = '';
			$font_weight_part   = '';

			if ( isset( $attributes['fontWeight'] ) && '400' !== $attributes['fontWeight'] ) {
				$font_weight        = $attributes['fontWeight'];
				$font_weight_handle = '_' . $font_weight;
				$font_weight_part   = ':' . $font_weight;
			}

			wp_enqueue_style(
				'google-font-' . esc_attr( $font_family_handle ) . esc_attr( $font_weight_handle ),
				'https://fonts.googleapis.com/css?family=' . esc_attr( $font_family ) . esc_attr( $font_weight_part ),
				null,
				'all'
			);
		}

		$block_name = 'wp-block-getwid-countdown';
		$class      = $block_name;

		if ( isset( $attributes['className'] ) ) {
			$class .= ' ' . $attributes['className'];
		}
		if ( isset( $attributes['align'] ) ) {
			$class .= ' align' . $attributes['align'];
		}
		if ( isset( $attributes['textAlignment'] ) ) {
			$class .= ' has-horizontal-alignment-' . $attributes['textAlignment'];
		}
		if ( isset( $attributes['innerPadding'] ) && 'default' !== $attributes['innerPadding'] ) {
			$class .= ' has-inner-paddings-' . $attributes['innerPadding'];
		}
		if ( isset( $attributes['innerSpacings'] ) && 'none' !== $attributes['innerSpacings'] ) {
			$class .= ' has-spacing-' . $attributes['innerSpacings'];
		}

		$wrapper_class = $block_name . '__content';
		$content_class = $block_name . '__wrapper';

		if ( isset( $attributes['fontSizeTablet'] ) && 'fs-tablet-100' !== $attributes['fontSizeTablet'] ) {
			$content_class .= ' ' . $attributes['fontSizeTablet'];
		}
		if ( isset( $attributes['fontSizeMobile'] ) && 'fs-mobile-100' !== $attributes['fontSizeMobile'] ) {
			$content_class .= ' ' . $attributes['fontSizeMobile'];
		}
		if ( isset( $attributes['fontSize'] ) && '' !== $attributes['fontSize'] ) {
			$content_class .= ' has-custom-font-size';
		}

		$content_style = '';

		if ( isset( $attributes['fontSize'] ) ) {
			$content_style .= 'font-size: ' . $attributes['fontSize'] . ';';
		}
		if ( isset( $attributes['fontFamily'] ) && '' !== $attributes['fontFamily'] ) {
			$content_style .= 'font-family: ' . $attributes['fontFamily'] . ';';
		}
		if ( isset( $attributes['fontWeight'] ) ) {
			$content_style .= 'font-weight: ' . $attributes['fontWeight'] . ';';
		}
		if ( isset( $attributes['fontStyle'] ) ) {
			$content_style .= 'font-style: ' . $attributes['fontStyle'] . ';';
		}
		if ( isset( $attributes['textTransform'] ) && 'default' !== $attributes['textTransform'] ) {
			$content_style .= 'text-transform: ' . $attributes['textTransform'] . ';';
		}
		if ( isset( $attributes['lineHeight'] ) ) {
			$content_style .= 'line-height: ' . $attributes['lineHeight'] . ';';
		}
		if ( isset( $attributes['letterSpacing'] ) ) {
			$content_style .= 'letter-spacing: ' . $attributes['letterSpacing'] . ';';
		}

		getwid_custom_color_style_and_class(
			$content_style,
			$content_class,
			$attributes,
			'color',
			getwid_is_block_editor()
		);

		try {
			$target_date = new \DateTime( $attributes['dateTime'] );
		} catch ( \Exception $e ) {
			return esc_html__( 'Invalid date.', 'getwid' );
		}

		$current_date = new \DateTime( current_time( 'Y-m-d H:i:s' ) );

		if ( $current_date < $target_date ) {
			$date_time_until = $current_date->diff( $target_date )->format( '+%yy +%mo +%dd +%hh +%im +%ss' );
		} else {
			$date_time_until = 'negative';
		}

		$countdown_options = array(
			! empty( $attributes['backgroundColor'] ) ? 'data-bg-color="' . esc_attr( $attributes['backgroundColor'] ) . '"' : '',
			! empty( $attributes['years'] ) ? 'data-years="' . esc_attr( $attributes['years'] ) . '"' : '',
			! empty( $attributes['months'] ) ? 'data-months="' . esc_attr( $attributes['months'] ) . '"' : '',
			! empty( $attributes['weeks'] ) ? 'data-weeks="' . esc_attr( $attributes['weeks'] ) . '"' : '',
			! empty( $attributes['days'] ) ? 'data-days="' . esc_attr( $attributes['days'] ) . '"' : '',
			! empty( $attributes['hours'] ) ? 'data-hours="' . esc_attr( $attributes['hours'] ) . '"' : '',
			! empty( $attributes['minutes'] ) ? 'data-minutes="' . esc_attr( $attributes['minutes'] ) . '"' : '',
			! empty( $attributes['seconds'] ) ? 'data-seconds="' . esc_attr( $attributes['seconds'] ) . '"' : '',
		);

		$countdown_options_str = implode( ' ', $countdown_options );

		ob_start();
		?>
		<div class="<?php echo esc_attr( $class ); ?>">
			<div class="<?php echo esc_attr( $content_class ); ?>" 
			<?php
			if ( ! empty( $content_style ) ) {
				?>
				style="<?php echo esc_attr( $content_style ); ?>"<?php } ?>>
				<div class="<?php echo esc_attr( $wrapper_class ); ?>"
					data-datetime="<?php echo esc_attr( ! empty( $date_time_until ) ? $date_time_until : '' ); ?>" <?php echo $countdown_options_str; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
				</div>
			</div>
		</div>
		<?php
		$result = ob_get_clean();

		$this->block_frontend_assets();

		return $result;
	}

	private function should_load_google_font( $attributes ) {

		$should_load = false;

		if ( isset( $attributes['fontFamily'] ) && ! empty( $attributes['fontFamily'] ) ) {
			$should_load = true;
		}

		if (
			$should_load &&
			isset( $attributes['fontGroupID'] ) &&
			! in_array( $attributes['fontGroupID'], array( '', 'google-fonts' ), true )
		) {
			$should_load = false;
		}

		return $should_load;
	}
}

getwid()->blocksManager()->addBlock(
	new Countdown()
);
