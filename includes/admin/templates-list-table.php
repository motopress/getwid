<?php

namespace Getwid\Admin;

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class TemplatesListTable extends \WP_List_Table {

	const POSTS_PER_PAGE = 20;

	/**
	 *
	 * @var string
	 */
	private $orderBy;

	/**
	 *
	 * @var string
	 */
	private $order;

	/**
	 *
	 * @var string
	 */
	private $post_type;

	/**
	 * Constructor.
	 */
	public function __construct(){

		parent::__construct( array(
			'singular'	 => 'template',
			'plural'	 => 'templates',
			'ajax'		 => false
		) );

		$this->post_type = getwid()->postTemplatePart()->postType;

		$this->orderBy	 = ( isset( $_GET['orderby'] ) ? sanitize_sql_orderby( $_GET['orderby'] ) : 'date' );
		$this->orderBy	 = preg_replace( '/\s+.*/', '', $this->orderBy ); // Remove order, allowed by sanitize_sql_orderby()
		$this->order	 = ( isset( $_GET['order'] ) ? strtoupper( sanitize_text_field( $_GET['order'] ) ) : 'ASC' );

		if ( !in_array( $this->order, array( 'ASC', 'DESC' ) ) ) {
			$this->order = 'ASC';
		}

		// Set descendant order for default case
		if ( $this->orderBy == 'date' ) {
			$this->order = 'DESC';
		}
	}

	/**
	 * This required method is where you prepare your data for display. This
	 * method will usually be used to query the database, sort and filter the
	 * data, and generally get it ready to be displayed. At a minimum, we should
	 * set $this->items and $this->set_pagination_args().
	 */
	public function prepare_items(){

		// The $this->_column_headers property takes an array to be used by
		// class for column headers
		$this->_column_headers = array(
			$this->get_columns(),
			array(),
			$this->get_sortable_columns()
		);

		// Handle bulk actions
		$this->process_bulk_action();

		// We'll use WP_Query manually to get the total amount of available
		// posts for pagination
		$queryAtts	 = array(
			'post_type'				 => $this->post_type,
			'post_status'			 => 'any',
			'posts_per_page'		 => self::POSTS_PER_PAGE,
			'paged'					 => $this->get_pagenum(),
			'orderby'				 => $this->orderBy,
			'order'					 => $this->order,
			'ignore_sticky_posts'	 => true,
			'suppress_filters'		 => false
		);

		$query		 = new \WP_Query();
		$this->items = $query->query( $queryAtts );

		$this->set_pagination_args( array(
			'total_items'	 => $query->found_posts,
			'per_page'		 => self::POSTS_PER_PAGE,
			'total_pages'	 => ceil( $query->found_posts / self::POSTS_PER_PAGE )
		) );
	}

	/**
	 * Required to dictate the table's columns and titles.
	 *
	 * @return array An associative array [ %slug% => %Title% ].
	 */
	public function get_columns(){

		$columns = array(
			'cb'	 => '<input type="checkbox" />',
			'title'	 => _x( 'Title', 'column name' )
		);

		if ( post_type_supports( $this->post_type, 'author' ) ) {
			$columns['author'] = __( 'Author' );
		}

		$columns['date'] = __( 'Date' );

		return $columns;
	}

	/**
	 *
	 * @return array
	 */
	public function get_sortable_columns(){

		$sortableColumns = array(
			'title' => array( 'title', ( $this->orderBy == 'title' ) ),
			'date' => array( 'date', ( $this->orderBy == 'date' ) )
		);
		return $sortableColumns;
	}

	/**
	 * This method is called when the parent class can't find a method
	 * specifically build for a given column.
	 *
	 * @param WP_Post $post A singular item (one full row's worth of data).
	 * @param string $columnName The name/slug of the column to be processed.
	 *
	 * @return string Text or HTML to be placed inside the column &lt;td&gt;.
	 */
	public function column_default( $post, $columnName ){
		switch ( $columnName ) {
			default:
				return '<span aria-hidden="true">&#8212;</span>';
		}
	}

	/**
	 * Required if displaying checkboxes or using bulk actions! The "cb" column
	 * is given special treatment when columns are processed. It always needs to
	 * have it's own method.
	 *
	 * @param WP_Post $post A singular item (one full row's worth of data).
	 *
	 * @return string Text or HTML to be placed inside the column &lt;td&gt;.
	 */
	public function column_cb( $post ){

		$show = current_user_can( 'edit_post', $post->ID );

		if ( $show ) {

			return sprintf(
				'<input type="checkbox" name="%1$s[]" value="%2$s" />',
				$this->_args['singular'],
				$post->ID
			);
		}
	}

	/**
	 *
	 * @param WP_Post $post
	 * @param string  $classes
	 * @param string  $data
	 * @param string  $primary
	 */
	protected function _column_title( $post, $classes, $data, $primary ) {
		echo '<td class="' . $classes . ' page-title" ', $data, '>';
		echo $this->column_title( $post );
		echo $this->handle_row_actions( $post, 'title', $primary );
		echo '</td>';
	}

	/**
	 * Handles the title column output.
	 *
	 * @global string $mode List table view mode.
	 *
	 * @param WP_Post $post The current WP_Post object.
	 */
	public function column_title( $post ) {

		global $mode;

		$can_edit_post = current_user_can( 'edit_post', $post->ID );

		if ( $can_edit_post && 'trash' !== $post->post_status ) {
			$lock_holder = wp_check_post_lock( $post->ID );

			if ( $lock_holder ) {
				$lock_holder   = get_userdata( $lock_holder );
				$locked_avatar = get_avatar( $lock_holder->ID, 18 );
				/* translators: %s: User's display name. */
				$locked_text = esc_html( sprintf( __( '%s is currently editing' ), $lock_holder->display_name ) );
			} else {
				$locked_avatar = '';
				$locked_text   = '';
			}

			echo '<div class="locked-info"><span class="locked-avatar">' . $locked_avatar . '</span> <span class="locked-text">' . $locked_text . "</span></div>\n";
		}

		echo '<strong>';

		$title = _draft_or_post_title( $post );

		if ( $can_edit_post && 'trash' !== $post->post_status ) {
			printf(
				'<a class="row-title" href="%s" aria-label="%s">%s</a>',
				get_edit_post_link( $post->ID ),
				/* translators: %s: Post title. */
				esc_attr( sprintf( __( '&#8220;%s&#8221; (Edit)' ), $title ) ),
				$title
			);
		} else {
			printf(
				'<span>%s</span>',
				$title
			);
		}

		echo "</strong>\n";
	}

	/**
	 * Generates and displays row action links.
	 *
	 * @param WP_Post $post        Post being acted upon.
	 * @param string  $column_name Current column name.
	 * @param string  $primary     Primary column name.
	 * @return string Row actions output for posts, or an empty string
	 *                if the current column is not the primary column.
	 */
	protected function handle_row_actions( $post, $column_name, $primary ) {
		if ( $primary !== $column_name ) {
			return '';
		}

		$post_type_object = get_post_type_object( $post->post_type );
		$can_edit_post    = current_user_can( 'edit_post', $post->ID );
		$actions          = array();
		$title            = _draft_or_post_title( $post );

		if ( $can_edit_post && 'trash' !== $post->post_status ) {
			$actions['edit'] = sprintf(
				'<a href="%s" aria-label="%s">%s</a>',
				get_edit_post_link( $post->ID ),
				/* translators: %s: Post title. */
				esc_attr( sprintf( __( 'Edit &#8220;%s&#8221;' ), $title ) ),
				__( 'Edit' )
			);
		}

		if ( current_user_can( 'delete_post', $post->ID ) ) {

			$actions['delete'] = sprintf(
				'<a href="%s" class="submitdelete" aria-label="%s">%s</a>',
				get_delete_post_link( $post->ID, '', true ),
				/* translators: %s: Post title. */
				esc_attr( sprintf( __( 'Delete &#8220;%s&#8221; permanently' ), $title ) ),
				__( 'Delete Permanently' )
			);

		}

		return $this->row_actions( $actions );
	}

	/**
	 * Method specially for column "Author".
	 *
	 * @param WP_Post $post A singular item (one full row's worth of data).
	 *
	 * @return string Text or HTML to be placed inside the column &lt;td&gt;.
	 */
	public function column_author( $post ){

		echo get_the_author();
	}

	/**
	 * Method specially for column "Date".
	 *
	 * @param WP_Post $post A singular item (one full row's worth of data).
	 *
	 * @return string Text or HTML to be placed inside the column &lt;td&gt;.
	 */
	public function column_date( $post ){

		global $mode;

		if ( '0000-00-00 00:00:00' === $post->post_date ) {
			$t_time    = __( 'Unpublished' );
			$time_diff = 0;
		} else {
			$t_time = sprintf(
				/* translators: 1: Post date, 2: Post time. */
				__( '%1$s at %2$s' ),
				/* translators: Post date format. See https://www.php.net/manual/datetime.format.php */
				get_the_time( __( 'Y/m/d' ), $post ),
				/* translators: Post time format. See https://www.php.net/manual/datetime.format.php */
				get_the_time( __( 'g:i a' ), $post )
			);

			$time      = get_post_timestamp( $post );
			$time_diff = time() - $time;
		}

		if ( 'publish' === $post->post_status ) {
			$status = __( 'Published' );
		} elseif ( 'future' === $post->post_status ) {
			if ( $time_diff > 0 ) {
				$status = '<strong class="error-message">' . __( 'Missed schedule' ) . '</strong>';
			} else {
				$status = __( 'Scheduled' );
			}
		} else {
			$status = __( 'Last Modified' );
		}

		/**
		 * Filters the status text of the post.
		 *
		 * @since 4.8.0
		 *
		 * @param string  $status      The status text.
		 * @param WP_Post $post        Post object.
		 * @param string  $column_name The column name.
		 * @param string  $mode        The list display mode ('excerpt' or 'list').
		 */
		$status = apply_filters( 'post_date_column_status', $status, $post, 'date', $mode );

		if ( $status ) {
			echo $status . '<br />';
		}

		/**
		 * Filters the published time of the post.
		 *
		 * @since 2.5.1
		 * @since 5.5.0 Removed the difference between 'excerpt' and 'list' modes.
		 *              The published time and date are both displayed now,
		 *              which is equivalent to the previous 'excerpt' mode.
		 *
		 * @param string  $t_time      The published time.
		 * @param WP_Post $post        Post object.
		 * @param string  $column_name The column name.
		 * @param string  $mode        The list display mode ('excerpt' or 'list').
		 */
		echo apply_filters( 'post_date_column_time', $t_time, $post, 'date', $mode );

	}

	/**
	 * @return array
	 */
	protected function get_bulk_actions() {
		$actions       = array();
		$post_type_obj = get_post_type_object( $this->post_type );

		if ( current_user_can( $post_type_obj->cap->delete_posts ) ) {
			$actions['delete'] = __( 'Delete Permanently' );
		}

		return $actions;
	}

	/**
	* Process bulk actions.
	* \wp-admin\edit.php
	*/
	public function process_bulk_action() {

		$action      = $this->current_action();
		$post_ids = isset( $_REQUEST['template'] ) ? wp_parse_id_list( wp_unslash( $_REQUEST['template'] ) ) : array();

		if ( empty( $post_ids ) ) {
			return;
		}

		$count    = 0;
		$failures = 0;

		check_admin_referer( 'bulk-' . $this->_args['plural'] );

		switch ( $action ) {

			case 'delete':
				foreach ( $post_ids as $post_id ) {

					if ( ! current_user_can( 'delete_post', $post_id ) ) {
						$failures++;
						continue;
					}

					if ( wp_check_post_lock( $post_id ) ) {
						$failures++;
						continue;
					}

					if ( wp_delete_post( $post_id, true ) ) {
						$count++;
					} else {
						$failures++;
					}
				}

				if ( $failures ) {
					add_settings_error(
						'getwid_bulk-actions',
						'getwid_bulk-actions',
						sprintf(
							/* translators: %d: Number of posts. */
							_n(
								'%d template failed to delete.',
								'%d templates failed to delete.',
								$failures,
								'getwid'
							),
							$failures
						),
						'error'
					);
				}

				if ( $count ) {
					add_settings_error(
						'getwid_bulk-actions',
						'getwid_bulk-actions',
						sprintf(
							/* translators: %d: Number of posts. */
							_n(
								'%d template deleted successfully.',
								'%d templates deleted successfully.',
								$count,
								'getwid'
							),
							$count
						),
						'success'
					);
				}

				break;
		}
	}

	/**
	 * Gets the name of the default primary column.
	 *
	 * @return string Name of the default primary column, in this case, 'title'.
	 */
	protected function get_default_primary_column_name() {
		return 'title';
	}

	/**
	 * Just a getter. Not required for WP_List_Table.
	 */
	public function get_plural(){
		return $this->_args['plural'];
	}

}
