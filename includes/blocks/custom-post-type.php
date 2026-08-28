<?php

namespace Getwid\Blocks;

class CustomPostType extends AbstractBlock {

	public function __construct() {

		parent::__construct( 'getwid/custom-post-type' );

		register_block_type(
			getwid_get_plugin_path( 'assets/blocks/custom-post-type' ),
			array(
				'render_callback' => array( $this, 'render_callback' ),
			)
		);
	}

	public function get_label() {
		return __( 'Custom Post Type', 'getwid' );
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

		$block_name = 'wp-block-getwid-custom-post-type';
		$post_type  = isset( $attributes['postType'] ) ? $attributes['postType'] : 'post';

		$extra_attr = array(
			'block_name' => $block_name,
		);

		$class  = $block_name;
		$class .= ' custom-post-type-' . $post_type;

		if ( isset( $attributes['align'] ) ) {
			$class .= ' align' . $attributes['align'];
		}
		if ( isset( $attributes['postLayout'] ) ) {
			$class .= ' has-layout-' . $attributes['postLayout'];
		}
		if ( isset( $attributes['spacing'] ) && 'default' !== $attributes['spacing'] ) {
			$class .= ' has-spacing-' . $attributes['spacing'];
		}
		if ( isset( $attributes['className'] ) ) {
			$class .= ' ' . $attributes['className'];
		}

		$wrapper_class = $block_name . '__wrapper';

		if ( isset( $attributes['columns'] ) && isset( $attributes['postLayout'] ) && 'grid' === $attributes['postLayout'] ) {
			$wrapper_class .= ' getwid-columns getwid-columns-' . $attributes['columns'];
		}

		ob_start();
		?>
		<div class="<?php echo esc_attr( $class ); ?>">
			<div class="<?php echo esc_attr( $wrapper_class ); ?>">
				<?php
				if ( ! $use_template ) {
					$template = $post_type;
					$located  = getwid_locate_template( 'custom-post-type/' . $post_type );
					if ( ! $located ) {
						$template = 'post';
					}
				}

				if ( $q->have_posts() ) {
					while ( $q->have_posts() ) :
						$q->the_post();
						?>
						<div class="wp-block-getwid-custom-post-type__post">
							<?php
							if ( $use_template ) {
								echo do_blocks( $template_part_content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							} else {
								getwid_get_template_part( 'custom-post-type/' . $template, $attributes, false, $extra_attr );
							}
							?>
						</div>
						<?php
					endwhile;

					wp_reset_postdata();
				} else {
					do_action( 'getwid/blocks/custom-post-type/no-items', $attributes, $content );
				}
				?>
			</div>

			<?php if ( isset( $attributes['pagination'] ) && $attributes['pagination'] ) : ?>
				<nav class="navigation pagination" role="navigation">
					<h2 class="screen-reader-text"><?php esc_html_e( 'Posts navigation', 'getwid' ); ?></h2>
					<div class="nav-links">
						<?php
						$total_pages = $q->max_num_pages;

						if ( isset( $attributes['offset'], $attributes['postsToShow'] ) && 0 !== $attributes['offset'] ) {
							$total_rows  = max( 0, $q->found_posts - $attributes['offset'] );
							$total_pages = ceil( $total_rows / $attributes['postsToShow'] );
						}

						$paged = is_front_page() ? get_query_var( 'page', 1 ) : get_query_var( 'paged', 1 );

						$pagination_args = array(
							'base'         => str_replace( 999999999, '%#%', esc_url( get_pagenum_link( 999999999 ) ) ),
							'total'        => $total_pages,
							'current'      => max( 1, $paged ),
							'format'       => '?paged=%#%',
							'show_all'     => false,
							'type'         => 'plain',
							'end_size'     => 2,
							'mid_size'     => 1,
							'prev_next'    => true,
							'prev_text'    => sprintf( '<i></i> %1$s', _x( '<', 'Previous post', 'getwid' ) ),
							'next_text'    => sprintf( '%1$s <i></i>', _x( '>', 'Next post', 'getwid' ) ),
							'add_args'     => false,
							'add_fragment' => '',
						);
						$pagination_args = apply_filters( 'getwid/blocks/custom_post_type/pagination_args', $pagination_args );
						echo paginate_links( $pagination_args ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						?>
					</div>
				</nav>
			<?php endif; ?>
		</div>
		<?php

		$result = ob_get_clean();

		return $result;
	}
}

getwid()->blocksManager()->addBlock(
	new CustomPostType()
);
