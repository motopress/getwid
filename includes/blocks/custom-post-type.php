<?php

namespace Getwid\Blocks;

class CustomPostType {

    private $block_name = 'getwid/custom-post-type';

    public function __construct() {

        register_block_type(
            'getwid/custom-post-type',
            array(
                'attributes' => array(
                    'postTemplate' => array(
                        'type' => 'string'
                    ),

                    //Custom Post Type
                    'postsToShow' => array(
                        'type' => 'number',
                        'default' => 5
                    ),
                    'pagination' => array(
                        'type' => 'boolean',
                        'default' => false
                    ),
                    'ignoreSticky' => array(
                        'type' => 'boolean',
                        'default' => true
                    ),
                    'filterById' => array(
                        'type' => 'string'
					),
                    'excludeById' => array(
                        'type' => 'string'
					),
                    'excludeCurrentPost' => array(
                        'type' => 'boolean',
                        'default' => false
                    ),
                    'parentPageId' => array(
                        'type' => 'string'
                    ),
                    'postType' => array(
                        'type' => 'string',
                        'default' => 'post'
                    ),
                    'taxonomy' => array(
                        'type' => 'array',
                        'items'   => [
                            'type' => 'string'
                        ],
                    ),
                    'terms' => array(
                        'type' => 'array',
                        'items'   => [
                            'type' => 'string'
                        ]
                    ),
                    'relation' => array(
                        'type' => 'string',
                        'default' => 'AND'
                    ),
                    'order' => array(
                        'type' => 'string',
                        'default' => 'desc'
                    ),
                    'orderBy' => array(
                        'type' => 'string',
                        'default' => 'date'
                    ),

                    //Custom Post Type
                    'postLayout' => array(
                        'type' => 'string',
                        'default' => 'list'
                    ),
                    'columns' => array(
                        'type' => 'number',
                        'default' => 3
                    ),
                    'spacing' => array(
                        'type' => 'string',
                        'default' => 'default'
                    ),
                    'align' => array(
                        'type' => 'string'
                    ),
                    'className' => array(
                        'type' => 'string'
                    )
                ),
                'render_callback' => [ $this, 'render_custom_post_type' ]
            )
        );
    }

    public function render_custom_post_type( $attributes, $content ) {

        //Custom Post Type
        $query_args = [];
        getwid_build_custom_post_type_query( $query_args, $attributes );

        $q = new \WP_Query( $query_args );
        //Custom Post Type

        //Custom Template
        $use_template = false;
        $template_part_content = '';

        if ( isset( $attributes['postTemplate'] ) && $attributes['postTemplate'] != '' ) {

            $template_post = get_post($attributes['postTemplate'], ARRAY_A);

            //If post exist and content not empty
            if ( ! is_null( $template_post ) && $template_post[ 'post_content' ] != '' ) {
                $use_template = true;
                $template_part_content = $template_post[ 'post_content' ];
            }
        }

        $block_name = 'wp-block-getwid-custom-post-type';
        $post_type =  isset( $attributes[ 'postType' ]) ? $attributes[ 'postType' ] : 'post';

        $extra_attr = array(
            'block_name' => $block_name
        );

        $class = $block_name;
        $class .= ' custom-post-type-' . esc_attr($post_type);

        if ( isset( $attributes[ 'align' ] ) ) {
            $class .= ' align' . esc_attr( $attributes[ 'align' ] );
        }
        if ( isset( $attributes['postLayout'] ) ) {
            $class .= " has-layout-".esc_attr( $attributes[ 'postLayout' ] );
        }
        if ( isset( $attributes['spacing'] ) && $attributes[ 'spacing' ] != 'default' ) {
            $class .= ' has-spacing-' . esc_attr( $attributes[ 'spacing' ] );
        }
        if ( isset( $attributes[ 'className' ] ) ) {
            $class .= ' ' . esc_attr( $attributes[ 'className' ] );
        }

        $wrapper_class = esc_attr( $block_name ) . '__wrapper';

        if ( isset( $attributes[ 'columns' ] ) && $attributes[ 'postLayout' ] === 'grid' ) {
            $wrapper_class .= " getwid-columns getwid-columns-" . esc_attr( $attributes[ 'columns' ] );
        }

        ob_start();
        ?>
        <div class="<?php echo esc_attr( $class ); ?>">
            <div class="<?php echo esc_attr( $wrapper_class );?>">
                <?php

                    if ( ! $use_template ) {
                        $template = $post_type;
                        $located = getwid_locate_template( 'custom-post-type/' . $post_type );
                        if ( ! $located ) {
                            $template = 'post';
                        }
                    }

                    if ( $q->have_posts() ){
                        ob_start();

                        while( $q->have_posts() ):
                            $q->the_post();

							?>
								<div class='wp-block-getwid-custom-post-type__post'>
									<?php
										if ($use_template){
											echo do_blocks( $template_part_content );
										} else {
											getwid_get_template_part( 'custom-post-type/' . $template, $attributes, false, $extra_attr );
										}
									?>
								</div>
							<?php

                        endwhile;

                        wp_reset_postdata();
                        ob_end_flush();
                    } else {
                        echo '<p>' . __( 'Nothing found.', 'getwid' ) . '</p>';
                    }
                ?>
            </div>

            <?php if ( isset( $attributes[ 'pagination' ] ) && $attributes['pagination'] ){ ?>
                <nav class="navigation pagination" role="navigation">
                    <h2 class="screen-reader-text"><?php __('Posts navigation', 'getwid') ?></h2>
                    <div class="nav-links">
                    <?php
	                    $pagination_args = array(
		                    'base'         => str_replace( 999999999, '%#%', esc_url( get_pagenum_link( 999999999 ) ) ),
		                    'total'        => $q->max_num_pages,
		                    'current'      => max( 1, get_query_var( 'paged' ) ),
		                    'format'       => '?paged=%#%',
		                    'show_all'     => false,
		                    'type'         => 'plain',
		                    'end_size'     => 2,
		                    'mid_size'     => 1,
		                    'prev_next'    => true,
		                    'prev_text'    => sprintf( '<i></i> %1$s', _x( '<', 'Previous post', 'getwid' ) ),
		                    'next_text'    => sprintf( '%1$s <i></i>', _x( '>', 'Next post', 'getwid' ) ),
		                    'add_args'     => false,
		                    'add_fragment' => ''
	                    );
	                    $pagination_args = apply_filters( 'getwid/blocks/custom_post_type/pagination_args', $pagination_args );
                        echo paginate_links( $pagination_args );
                    ?>
                    </div>
                </nav>
            <?php } ?>
        </div>
        <?php

        $result = ob_get_clean();
        return $result;
    }
}

new \Getwid\Blocks\CustomPostType();
