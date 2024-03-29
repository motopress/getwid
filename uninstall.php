<?php
/**
 * Uninstall all Getwid data.
 *
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

$options = array(
	'getwid_db_version',
	'getwid_db_version_history',

	'getwid_instagram_token',
	'getwid_instagram_cache_timeout',
	'getwid_instagram_token_cron_error_message',

	'getwid_google_api_key',

	'getwid_mailchimp_api_key',

	'getwid_recaptcha_v2_site_key',
	'getwid_recaptcha_v2_secret_key',

	'getwid_section_content_width',
	'getwid_smooth_animation',

	'getwid_autoptimize',
	'getwid_aggregate_css',

	'getwid_load_assets_on_demand',
	'getwid_move_css_to_head',

	/*
	 * SELECT `option_name` FROM `wp_options` WHERE `option_name` LIKE '%getwid/%' LIMIT 100
	 */
	'getwid/accordion::disabled',
	'getwid/advanced-heading::disabled',
	'getwid/advanced-spacer::disabled',
	'getwid/anchor::disabled',
	'getwid/banner::disabled',
	'getwid/button-group::disabled',
	'getwid/circle-progress-bar::disabled',
	'getwid/contact-form::disabled',
	'getwid/content-timeline::disabled',
	'getwid/countdown::disabled',
	'getwid/counter::disabled',
	'getwid/custom-post-type::disabled',
	'getwid/icon-box::disabled',
	'getwid/icon::disabled',
	'getwid/image-box::disabled',
	'getwid/image-hotspot::disabled',
	'getwid/images-slider::disabled',
	'getwid/images-stack::disabled',
	'getwid/instagram::disabled',
	'getwid/mailchimp::disabled',
	'getwid/map::disabled',
	'getwid/media-text-slider::disabled',
	'getwid/person::disabled',
	'getwid/post-carousel::disabled',
	'getwid/post-slider::disabled',
	'getwid/price-box::disabled',
	'getwid/price-list::disabled',
	'getwid/progress-bar::disabled',
	'getwid/recent-posts::disabled',
	'getwid/section::disabled',
	'getwid/social-links::disabled',
	'getwid/table-of-contents::disabled',
	'getwid/table::disabled',
	'getwid/tabs::disabled',
	'getwid/template-library::disabled',
	'getwid/template-post-author::disabled',
	'getwid/template-post-button::disabled',
	'getwid/template-post-categories::disabled',
	'getwid/template-post-comments::disabled',
	'getwid/template-post-content::disabled',
	'getwid/template-post-custom-field::disabled',
	'getwid/template-post-date::disabled',
	'getwid/template-post-featured-background-image::disabled',
	'getwid/template-post-featured-image::disabled',
	'getwid/template-post-link::disabled',
	'getwid/template-post-meta::disabled',
	'getwid/template-post-tags::disabled',
	'getwid/template-post-title::disabled',
	'getwid/testimonial::disabled',
	'getwid/toggle::disabled',
	'getwid/video-popup::disabled',

	'getwid/template-acf-background-image::disabled',
	'getwid/template-acf-image::disabled',
	'getwid/template-acf-select::disabled',
	'getwid/template-acf-wysiwyg::disabled',
);

if ( ! is_multisite() ) {

	foreach ( $options as $option ) {
		delete_option( $option );
	}

	// Remove scheduled events.
	foreach ( array( 'getwid_refresh_instagram_token' ) as $event ) {
		if ( wp_get_schedule( $event ) ) {
			wp_clear_scheduled_hook( $event );
		}
	}

} else {

	global $wpdb;

	$blog_ids = $wpdb->get_col( "SELECT blog_id FROM $wpdb->blogs" );

	foreach ( $blog_ids as $blog_id ) {

		switch_to_blog( $blog_id );

		foreach ( $options as $option ) {
			delete_option( $option );
		}

		// Remove scheduled events.
		foreach ( array( 'getwid_refresh_instagram_token' ) as $event ) {
			if ( wp_get_schedule( $event ) ) {
				wp_clear_scheduled_hook( $event );
			}
		}

		restore_current_blog();
	}

}

// All done.
