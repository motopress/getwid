<?php

namespace Getwid\Blocks;

class RecentPosts extends \Getwid\Blocks\AbstractBlock {

	protected static $blockName = 'getwid/recent-posts';

    public function __construct() {

		parent::__construct( self::$blockName );

        register_block_type(
            'getwid/recent-posts',
            array(
				'attributes' => array(
					'titleTag' => array(
						'type' => 'string',
						'default' => 'h3',
					),
					'imageSize' => array(
						'type' => 'string',
						'default' => 'large',
					),
					'cropImages' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'categories' => array(
						'type' => 'string',
					),
					'postsToShow' => array(
						'type' => 'number',
						'default' => 5,
					),
					'showTitle' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'showDate' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'showCategories' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'showCommentsCount' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'showContent' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'contentLength' => array(
						'type' => 'number',
						'default' => apply_filters('excerpt_length', 55),
					),
					'showFeaturedImage' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'postLayout' => array(
						'type' => 'string',
						'default' => 'list',
					),
					'columns' => array(
						'type' => 'number',
						'default' => 3,
					),
					'align' => array(
						'type' => 'string',
					),
					'order' => array(
						'type' => 'string',
						'default' => 'desc',
					),
					'orderBy' => array(
						'type' => 'string',
						'default' => 'date',
					),

					'className' => array(
						'type' => 'string',
					),
				),
                'render_callback' => [ $this, 'render_callback' ]
            )
        );
    }

	public function getLabel() {
		return __('Recent Posts', 'getwid');
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
				$assets[] = getwid()->settings()->getPrefix() . '-blocks-common';

				return $assets;
			}
		);

		add_filter( 'getwid/optimize/should_load_common_css', '__return_true' );

		wp_enqueue_style(
			self::$blockName,
			getwid_get_plugin_url( 'assets/blocks/recent-posts/style.css' ),
			[],
			getwid()->settings()->getVersion()
		);

	}

    public function render_callback( $attributes, $content ) {

		$query_args = array(
			'posts_per_page'   => $attributes['postsToShow'],
			'ignore_sticky_posts' => 1,
			'post_status'      => 'publish',
			'order'            => $attributes['order'],
			'orderby'          => $attributes['orderBy'],
		);

		if ( isset( $attributes['categories'] ) ) {
			$query_args['tax_query'] = array(
				array(
					'taxonomy' => 'category',
					'field' => 'id',
					'terms' => $attributes['categories']
				)
			);
		}

		$block_name = 'wp-block-getwid-recent-posts';

		$extra_attr = array(
			'block_name' => $block_name
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
		if( isset( $attributes['cropImages'] ) && $attributes['cropImages'] === true ){
			$class .= ' has-cropped-images';
		}

		$wrapper_class = $block_name . '__wrapper';

		if ( isset( $attributes['columns'] ) && $attributes['postLayout'] === 'grid' ) {
			$wrapper_class .= ' getwid-columns getwid-columns-' . $attributes['columns'];
		}

		$q = new \WP_Query( $query_args );
		ob_start();
		?>

		<div class="<?php echo esc_attr( $class ); ?>">
			<div class="<?php echo esc_attr( $wrapper_class );?>">
				<?php
				if ( $q->have_posts() ):
					ob_start();

					while( $q->have_posts() ):
						$q->the_post();
						getwid_get_template_part('recent-posts/post', $attributes, false, $extra_attr);
					endwhile;

					wp_reset_postdata();
					ob_end_flush();
				else:
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
	new \Getwid\Blocks\RecentPosts()
);
