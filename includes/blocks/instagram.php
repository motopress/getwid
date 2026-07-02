<?php

namespace Getwid\Blocks\New;

use Getwid\StringEncryption;

class Instagram extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/instagram' );

		add_action( 'wp_ajax_check_instagram_token', array( $this, 'check_instagram_token' ) );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/instagram' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);

		getwid_maybe_add_option( 'getwid_instagram_token', '', true );
	}

	public function get_label() {
		return __( 'Instagram', 'getwid' );
	}

	public function check_instagram_token() {

		check_ajax_referer( 'getwid_nonce_check_instagram_token', 'nonce' );

		$response = (bool) get_option( 'getwid_instagram_token', '' );

		wp_send_json_success( $response );
	}

	public function block_frontend_assets() {

		if ( is_admin() ) {
			return;
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
				'photoCount'  => 6,
				'gridColumns' => 3,
				'spacing'     => 'default',
			)
		);
		$encryption = new StringEncryption();

		$access_token = $encryption->decrypt( get_option( 'getwid_instagram_token', '' ) );

		if ( empty( $access_token ) ) {
			if ( current_user_can( 'manage_options' ) ) {
				return '<p>' . sprintf(
					// translators: %s is a link.
					__( 'Instagram Access Token is not set. <a href="%s">Connect Instagram Account</a>.', 'getwid' ),
					esc_url( getwid()->settingsPage()->getTabUrl( 'general' ) )
				) . '</p>';
			}

			return '';
		}

		$instagram_media = get_transient( 'getwid_instagram_response_data' );

		if ( false === $instagram_media ) {
			$api_uri = 'https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption,thumbnail_url&access_token=' . $access_token . '&limit=100';

			$response = wp_remote_get(
				$api_uri,
				array( 'timeout' => 15 )
			);

			if ( is_wp_error( $response ) ) {
				if ( current_user_can( 'manage_options' ) ) {
					return '<p>' . esc_html( $response->get_error_message() ) . '</p>';
				}

				return '';
			}

			$instagram_media = json_decode( wp_remote_retrieve_body( $response ), false );

			if ( JSON_ERROR_NONE === json_last_error() ) {
				if ( isset( $instagram_media->data ) ) {
					$expiration = intval( get_option( 'getwid_instagram_cache_timeout', 30 ) );

					set_transient( 'getwid_instagram_response_data', $instagram_media, $expiration * MINUTE_IN_SECONDS );
				} elseif ( current_user_can( 'manage_options' ) ) {
					return '<p>' . esc_html( $instagram_media->error->message ) . '</p>';
				} else {
					return '';
				}
			} else {
				return __( 'Error in json_decode.', 'getwid' );
			}
		}

		$class      = 'wp-block-getwid-instagram';
		$block_name = 'wp-block-getwid-instagram';

		if ( isset( $attributes['align'] ) ) {
			$class .= ' align' . $attributes['align'];
		}

		$wrapper_class  = 'wp-block-getwid-instagram__wrapper';
		$wrapper_class .= ' has-' . $attributes['gridColumns'] . '-columns';

		if ( isset( $attributes['spacing'] ) && 'default' !== $attributes['spacing'] ) {
			$class .= ' has-spacing-' . $attributes['spacing'];
		}

		if ( isset( $attributes['className'] ) ) {
			$class .= ' ' . $attributes['className'];
		}

		ob_start();
		?>
		<div class="<?php echo esc_attr( $class ); ?>">
			<div class="<?php echo esc_attr( $wrapper_class ); ?>">
				<?php
				$counter = 1;
				foreach ( $instagram_media->data as $value ) {
					if ( $counter <= $attributes['photoCount'] ) {
						$extra_attr = array(
							'block_name' => $block_name,
							'post'       => $value,
						);
						getwid_get_template_part( 'instagram/post', $attributes, false, $extra_attr );
					}
					++$counter;
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
	new Instagram()
);
