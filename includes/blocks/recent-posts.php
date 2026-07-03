<?php

namespace Getwid\Blocks;

class RecentPosts extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/recent-posts' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/recent-posts' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Recent Posts', 'getwid' );
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

		$query_args = array(
			'posts_per_page'      => $attributes['postsToShow'],
			'ignore_sticky_posts' => 1,
			'post_status'         => 'publish',
			'order'               => $attributes['order'],
			'orderby'             => $attributes['orderBy'],
		);

		if ( isset( $attributes['categories'] ) ) {
			$query_args['tax_query'] = array(
				array(
					'taxonomy' => 'category',
					'field'    => 'id',
					'terms'    => $attributes['categories'],
				),
			);
		}

		$block_name = 'wp-block-getwid-recent-posts';

		$extra_attr = array(
			'block_name' => $block_name,
		);

		$class = $block_name;

		if ( isset( $attributes['align'] ) ) {
			$class .= ' align' . $attributes['align'];
		}
		if ( isset( $attributes['postLayout'] ) ) {
			$class .= ' has-layout-' . $attributes['postLayout'];
		}
		if ( isset( $attributes['showPostDate'] ) && $attributes['showPostDate'] ) {
			$class .= ' has-dates';
		}
		if ( isset( $attributes['className'] ) ) {
			$class .= ' ' . $attributes['className'];
		}
		if ( isset( $attributes['cropImages'] ) && true === $attributes['cropImages'] ) {
			$class .= ' has-cropped-images';
		}

		$wrapper_class = $block_name . '__wrapper';

		if ( isset( $attributes['columns'] ) && 'grid' === $attributes['postLayout'] ) {
			$wrapper_class .= ' getwid-columns getwid-columns-' . $attributes['columns'];
		}

		$attributes['titleTag'] = $this->validateHeadingHTMLTag( $attributes['titleTag'] );

		$q = new \WP_Query( $query_args );
		ob_start();
		?>

		<div class="<?php echo esc_attr( $class ); ?>">
			<div class="<?php echo esc_attr( $wrapper_class ); ?>">
				<?php
				if ( $q->have_posts() ) :
					ob_start();

					while ( $q->have_posts() ) :
						$q->the_post();
						getwid_get_template_part( 'recent-posts/post', $attributes, false, $extra_attr );
					endwhile;

					wp_reset_postdata();
					ob_end_flush();
				else :
					do_action( 'getwid/blocks/recent-posts/no-items', $attributes, $content );
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
	new RecentPosts()
);
