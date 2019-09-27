<?php

namespace Getwid;

/**
 * Class ScriptsManager
 * @package Getwid
 */
class ScriptsManager {

	private $version;
	private $prefix;

	private $savedID;

	/**
	 * ScriptsManager constructor.
	 *
	 * @param Settings $settings Plugin settings
	 *
	 */
	public function __construct( $settings ) {

		$this->version = $settings->getVersion();
		$this->prefix  = $settings->getPrefix();

		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueueEditorAssets'     ] ); //Backend only
		add_action( 'enqueue_block_assets'       , [ $this, 'enqueueFrontBlockAssets' ] ); //Frontend only

		add_action( 'after_theme_setup', [ $this, 'getwid_enqueue_editor_section_css' ] );
	}

	public function getwid_get_image_sizes() {

		global $_wp_additional_image_sizes;

		$intermediate_image_sizes = get_intermediate_image_sizes();

		$image_sizes = array();
		foreach ( $intermediate_image_sizes as $size ) {
			if ( isset( $_wp_additional_image_sizes[ $size ] ) ) {
				$image_sizes[ $size ] = array(
					'width'  => $_wp_additional_image_sizes[ $size ][ 'width' ],
					'height' => $_wp_additional_image_sizes[ $size ][ 'height' ]
				);
			} else {
				$image_sizes[ $size ] = array(
					'width'  => intval( get_option( "{$size}_size_w" ) ),
					'height' => intval( get_option( "{$size}_size_h" ) )
				);
			}
		}

		$sizes_arr = [];
		foreach ( $image_sizes as $key => $value ) {
			$temp_arr = [];
			$temp_arr[ 'value' ] = $key;
			$temp_arr[ 'label' ] = ucwords( strtolower( preg_replace( '/[-_]/', ' ', $key ) ) ) . " - {$value['width']} x {$value['height']}";
			$sizes_arr[] = $temp_arr;
		}

		$sizes_arr[] = array(
			'value' => 'full',
			'label' => __( 'Full Size', 'getwid' )
		);

		return $sizes_arr;
	}

	public function getwid_load_locale_data() {
		$locale_data = $this->getwid_locale_data( 'gutenberg' );
		wp_add_inline_script(
			'wp-i18n',
			'wp.i18n.setLocaleData( ' . json_encode( $locale_data ) . ' );'
		);
	}

	public function getwid_locale_data( $domain ) {
		$translations = get_translations_for_domain( $domain );

		$locale = array(
			'' => array(
				'domain' => $domain,
				'lang'   => is_admin() ? get_user_locale() : get_locale(),
			),
		);

		if ( ! empty( $translations->headers[ 'Plural-Forms' ] ) ) {
			$locale[ '' ][ 'plural_forms' ] = $translations->headers[ 'Plural-Forms' ];
		}

		foreach ( $translations->entries as $msgid => $entry ) {
			$locale[ $msgid ] = $entry->translations;
		}

		return $locale;
	}


	/**
	 * Enqueue editor-only js and css (Enqueue scripts (only on Edit Post Page))
	 */
	public function enqueueEditorAssets() {
		//Scripts
		wp_enqueue_script(
			'draggabilly',
			getwid_get_plugin_url( 'vendors/draggabilly/draggabilly.pkgd.min.js' ),
			[ 'jquery' ],
			'2.2.0',
			true
		);

		wp_enqueue_script(
			'jquery-plugin',
			getwid_get_plugin_url( 'vendors/jquery.countdown/jquery.plugin.min.js' ),
			[ 'jquery' ],
			'1.0',
			true
		);

		// countdown
		wp_enqueue_script(
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
				wp_enqueue_script(
					'jquery-countdown-' . $locale_prefix,
					getwid_get_plugin_url( $locale_path ),
					[ 'jquery-countdown' ],
					'2.1.0',
					true
				);
			}
		}
		// countdown

		wp_enqueue_script(
			'popper',
			getwid_get_plugin_url( 'vendors/tippy.js/popper.min.js' ),
			[ 'jquery' ],
			'1.15.0',
			true
		);
		wp_enqueue_script(
			'tippy',
			getwid_get_plugin_url( 'vendors/tippy.js/index.all.min.js' ),
			[ 'jquery', 'popper' ],
			'4.3.5',
			true
		);
		wp_enqueue_script(
			'slick',
			getwid_get_plugin_url( 'vendors/slick/slick/slick.min.js' ),
			[ 'jquery' ],
			'1.9.0',
			true
		);
		wp_enqueue_script(
			'wow',
			getwid_get_plugin_url( 'vendors/wow.js/dist/wow.min.js' ),
			[ 'jquery' ],
			'1.2.1',
			true
		);
		wp_enqueue_script(
			'countup',
			getwid_get_plugin_url( 'vendors/countup.js/dist/countUp.min.js' ),
			[],
			'2.0.4',
			true
		);
		wp_enqueue_script(
			'waypoints',
			getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
			[ 'jquery' ],
			'4.0.1',
			true
		);

		//Styles
		wp_enqueue_style(
			'tippy-themes',
			getwid_get_plugin_url( 'vendors/tippy.js/themes.css' ),
			[],
			'4.3.5'
		);

		wp_enqueue_style(
			'magnific-popup',
			getwid_get_plugin_url( 'vendors/magnific-popup/magnific-popup.css' ),
			[],
			'1.1.0'
		);

		wp_enqueue_style(
			'slick',
			getwid_get_plugin_url( 'vendors/slick/slick/slick.min.css' ),
			[],
			'1.9.0'
		);

		wp_enqueue_style(
			'slick-theme',
			getwid_get_plugin_url( 'vendors/slick/slick/slick-theme.min.css' ),
			[],
			'1.9.0'
		);

		wp_enqueue_style(
			'animate',
			getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
			[],
			'3.7.0'
		);

		wp_enqueue_style(
			'fonticonpicker-base-theme',
			getwid_get_plugin_url( 'vendors/fonticonpicker/react-fonticonpicker/dist/fonticonpicker.base-theme.react.css' ),
			null,
			'1.2.0'
		);

		wp_enqueue_style(
			'fonticonpicker-react-theme',
			getwid_get_plugin_url( 'vendors/fonticonpicker/react-fonticonpicker/dist/fonticonpicker.material-theme.react.css' ),
			null,
			'1.2.0'
		);	

		// Enqueue the bundled block JS file
		wp_enqueue_script(
			"{$this->prefix}-blocks-editor-js",
			getwid_get_plugin_url( 'assets/js/editor.blocks.js' ),
			[
				'wp-i18n',
				'wp-editor',
				'wp-element',
				'wp-blocks',
				'wp-components',
				'wp-api',
				'wp-api-fetch',
				'imagesloaded',
				'jquery-countdown',
				'jquery-plugin',
				'popper',
				'tippy',
				'slick',
				'wow',
				'countup',
				'waypoints',
				'jquery-ui-tabs',
				'jquery-ui-accordion',

				'draggabilly',
			],
			$this->version,
			true
		);

		wp_localize_script(
			"{$this->prefix}-blocks-editor-js",
			'Getwid',
			apply_filters(
				'getwid/editor_blocks_js/localize_data',
				[
					'localeData' => $this->getwid_locale_data( 'getwid' ),
					'settings' => [
						'date_time_utc' => current_time('Y-m-d H:i:s'),
						'post_type' => get_post_type(),
						'google_api_key'  => get_option( 'getwid_google_api_key', '' ),
						'instagram_token' => get_option( 'getwid_instagram_token', '' ),

						'assets_path' => getwid_get_plugin_url( '/assets' ),
						'image_sizes' => $this->getwid_get_image_sizes(),

						'excerpt_length'       => apply_filters( 'excerpt_length', 55 ),
						'recaptcha_site_key'   => get_option( 'getwid_recaptcha_v2_site_key'  , '' ),
						'recaptcha_secret_key' => get_option( 'getwid_recaptcha_v2_secret_key', '' ),
						'mailchimp_api_key'    => get_option( 'getwid_mailchimp_api_key'      , '' )
					],
					'templates' => [
						'name' => PostTemplatePart::$postType,
						'new' => admin_url( 'post-new.php?post_type=' . PostTemplatePart::$postType ),
						'view' => admin_url( 'edit.php?post_type=' . PostTemplatePart::$postType ),
						'edit' => admin_url( 'post.php?post=' ),
					],
					'ajax_url' => admin_url( 'admin-ajax.php' ),
					'options_writing_url' => admin_url( 'options-writing.php' ),
					'nonces' => array(
						'google_api_key' => wp_create_nonce( 'getwid_nonce_google_api_key' ),
						'recaptcha_v2_contact_form' => wp_create_nonce( 'getwid_nonce_contact_form' ),
						'mailchimp_api_key' => wp_create_nonce( 'getwid_nonce_mailchimp_api_key' )
					)
				]
			)
		);

		// Enqueue optional editor only styles
		wp_enqueue_style(
			"{$this->prefix}-blocks-editor",
			getwid_get_plugin_url( 'assets/css/blocks.editor.css' ),
			null,
			$this->version
		);
	}

	// 'getwid/image-hotspot' => array(
	// 	'js' => array(
	// 		'popper',            
	// 		'tippy',     
	// 		'waypoints'
	// 	),
	// 	'css' => array(
	// 		'tippy-themes', 
	// 	)
	// ), 

	public function getwid_enqueue_assets_as_required($assets, $block_name, $type, $post_id = null) {

		if ( $type == 'js' ) {
			if ( has_block( $block_name, $post_id ) ) {

				// if ( $block_name == 'getwid/circle-progress-bar' ) {
				// 	var_dump( 'getwid/circle-progress-bar' );
				// 	exit;
				// }

				//var_dump( $block_name );

				foreach ( $assets as $index => $script_name ) {

					//if script not enqueued (enqueued it)
					if ( ! wp_script_is( $script_name, 'enqueued' ) ) {

						wp_enqueue_script( $script_name );
					}							
				}
			}
		} elseif ( $type == 'css' ) {
			if ( has_block( $block_name, $post_id ) ) {
				foreach ( $assets as $index => $style_name ) {

					//if style not enqueued (enqueued it)
					if ( ! wp_style_is( $style_name, 'enqueued' ) ) {

						wp_enqueue_style( $style_name );
					}							
				}
			}
		}
	}

	/* #region old function */
	// public function getwid_enqueue_assets_recursive( $current_page_obj, $assets, $block_name, $id = '' ) {
	// 	if ( is_home() || is_archive() || is_single() ) { //blog || archive
	// 		foreach ( $current_page_obj as $post_index => $post ) {

	// 			$inner_current_page_obj = get_posts( [ 'include' => [ $post->ID ] ] );

	// 			if ( $inner_current_page_obj[ 0 ]->ID == $id ) {
	// 				$this->getwid_enqueue_assets_as_required( $assets, $block_name, 'js', $post->ID );
	// 				return;
	// 			} else {
	// 				$id = $inner_current_page_obj[ 0 ]->ID;
	// 				$this->getwid_enqueue_assets_recursive( $inner_current_page_obj, $assets, $block_name, $id );
	// 			}
	// 		}
	// 	} else {
	// 		$this->getwid_enqueue_assets_as_required( $assets, $block_name, 'js' );
	// 	}
	// }
	/* #endregion */

	public function getwid_enqueue_assets_recursive( $current_page_obj, $tree, $id = '' ) {

		//blog || archive
		if ( is_home() || is_archive() || is_single() ) {

			// var_dump( $current_page_obj );
			// exit;

			foreach ( $current_page_obj as $post_index => $post ) {				



				$inner_current_page_obj = get_posts( [ 'include' => [ $post->ID ] ] );

				foreach ( $inner_current_page_obj as $array_index => $post_inner ) {

					$this->savedID = $post_inner->ID;

					// if ( $post_inner->post_title != 'Image Post 2' ) {
					// 	var_dump( $inner_current_page_obj );
					// 	exit;
					// }
				
					if ( $this->savedID == $id ) {

						// var_dump( 'Here' );
						// exit;

						foreach ( $tree as $block_name => $block_dependency ) {
							foreach ( $block_dependency as $type => $assets ) {							
	
								$this->getwid_enqueue_assets_as_required( $assets, $block_name, $type, $post->ID );
							}
						}
						return;
					} else {
						$this->getwid_enqueue_assets_recursive( $post_inner, $tree, $this->savedID );
					}
				}

				// if ( $inner_current_page_obj[ 0 ]->ID == $id ) {
				// 	//enqueue assets for blog/archive
				// 	foreach ( $tree as $block_name => $block_dependency ) {
				// 		foreach ( $block_dependency as $type => $assets ) {							

				// 			$this->getwid_enqueue_assets_as_required( $assets, $block_name, $type, $post->ID );
				// 		}
				// 	}
				// 	return;
				// } else {
				// 	$id = $inner_current_page_obj[ 0 ]->ID;
				// 	$this->getwid_enqueue_assets_recursive( $inner_current_page_obj, $tree, $id );
				// }
			}
		} elseif ( is_page() ) {
			foreach ( $tree as $block_name => $block_dependency ) {
				foreach ( $block_dependency as $type => $assets ) {
					$this->getwid_enqueue_assets_as_required( $assets, $block_name, $type );
				}
			}
		}
	}

	/**
	 * Enqueue frontend-only block js and css
	 */
	public function enqueueFrontBlockAssets() {
		//Backend & Frontend
		wp_enqueue_style(
			"{$this->prefix}-blocks",
			getwid_get_plugin_url( 'assets/css/blocks.style.css' ),
			apply_filters(
				'getwid/blocks_style_css/dependencies',
				[]
			),
			$this->version
		);

		wp_add_inline_style( "{$this->prefix}-blocks", getwid_generate_section_content_width_css() );
		// -Backend & Frontend

		if ( is_admin() ) {
			return;
		}

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

		//Scripts
		preg_match( '/^(.*)_/', get_locale(), $current_locale );
		$locale_prefix = isset( $current_locale[ 1 ] ) && $current_locale[ 1 ] !='en' ? $current_locale[ 1 ] : '';

		if ( $locale_prefix != '' ) {
			$locale_path = 'vendors/jquery.countdown/localization/jquery.countdown-' . $locale_prefix . '.js';

			if ( file_exists( getwid_get_plugin_path( $locale_path ) ) ) {
				wp_enqueue_script(
					'jquery-countdown-' . $locale_prefix,
					getwid_get_plugin_url( $locale_path ),
					[ 'jquery-countdown' ],
					'2.1.0',
					true
				);
			}
		}

		wp_register_script(
			'popper',
			getwid_get_plugin_url( 'vendors/tippy.js/popper.min.js' ),
			[ 'jquery' ],
			'1.15.0',
			true
		);
		wp_register_script(
			'tippy',
			getwid_get_plugin_url( 'vendors/tippy.js/index.all.min.js' ),
			[ 'jquery', 'popper' ],
			'4.3.5',
			true
		);
		wp_register_script(
			'magnific-popup',
			getwid_get_plugin_url( 'vendors/magnific-popup/jquery.magnific-popup.min.js' ),
			[ 'jquery' ],
			'1.1.0',
			true
		);
		wp_register_script(
			'slick',
			getwid_get_plugin_url( 'vendors/slick/slick/slick.min.js' ),
			[ 'jquery' ],
			'1.9.0',
			true
		);
		wp_register_script(
			'wow',
			getwid_get_plugin_url( 'vendors/wow.js/dist/wow.min.js' ),
			[ 'jquery' ],
			'1.2.1',
			true
		);
		wp_register_script(
			'countup',
			getwid_get_plugin_url( 'vendors/countup.js/dist/countUp.min.js' ),
			[],
			'2.0.4',
			true
		);
		wp_register_script(
			'waypoints',
			getwid_get_plugin_url( 'vendors/waypoints/lib/jquery.waypoints.min.js' ),
			[ 'jquery' ],
			'4.0.1',
			true
		);

		//Styles
		wp_register_style(
			'tippy-themes',
			getwid_get_plugin_url( 'vendors/tippy.js/themes.css' ),
			[],
			'4.3.5'
		);

		wp_register_style(
			'magnific-popup',
			getwid_get_plugin_url( 'vendors/magnific-popup/magnific-popup.css' ),
			[],
			'1.1.0'
		);

		wp_register_style(
			'slick',
			getwid_get_plugin_url( 'vendors/slick/slick/slick.min.css' ),
			[],
			'1.9.0'
		);

		wp_register_style(
			'slick-theme',
			getwid_get_plugin_url( 'vendors/slick/slick/slick-theme.min.css' ),
			[],
			'1.9.0'
		);

		wp_register_style(
			'animate',
			getwid_get_plugin_url( 'vendors/animate.css/animate.min.css' ),
			[],
			'3.7.0'
		);

		//Load necessary block JS/CSS
		/* #region old tree */
		// $blocks_dependency_tree = array(
		// 	'js' => array(
		// 		'getwid/accordion' => array(
		// 			'jquery-ui-accordion'
		// 		),
		// 		'getwid/circle-progress-bar' => array(
		// 			'waypoints',
		// 		),
		// 		'getwid/countdown' => array(
		// 			'jquery-plugin',
		// 			'jquery-countdown',
		// 		),
		// 		'getwid/counter' => array(
		// 			'waypoints',
		// 			'countup',
		// 		),
		// 		'getwid/custom-post-type' => array( //[!]
		// 			'slick',
		// 			'waypoints',
		// 			'countup',		
		// 			'popper',            
		// 			'tippy',  
		// 			'wow',	
		// 			'waypoints',
		// 			'jquery-plugin',
		// 			'jquery-countdown',	
		// 			'jquery-ui-accordion',	
		// 			'jquery-ui-tabs',	
		// 			'magnific-popup',									
		// 		),
		// 		'getwid/image-hotspot' => array(
		// 			'popper',            
		// 			'tippy',     
		// 			'waypoints'
		// 		), 
		// 		'getwid/images-slider' => array(
		// 			'slick',          
		// 		),        
		// 		'getwid/media-text-slider' => array(
		// 			'slick',
		// 		),
		// 		'getwid/post-carousel' => array(
		// 			'slick',
		// 		),
		// 		'getwid/post-slider' => array(
		// 			'slick',
		// 		),    
		// 		'getwid/progress-bar' => array(
		// 			'waypoints',
		// 		),
		// 		'getwid/section' => array(
		// 			'slick',
		// 			'wow',
		// 		),          
		// 		'getwid/tabs' => array(
		// 			'jquery-ui-tabs',
		// 		),
		// 		'getwid/video-popup' => array(
		// 			'magnific-popup',
		// 		),
		// 	),
		// 	'css' => array(
		// 		'getwid/banner' => array(
		// 			'animate',
		// 		),
		// 		'getwid/icon' => array(
		// 			'animate',
		// 		), 
		// 		'getwid/icon-box' => array(
		// 			'animate',
		// 		), 
		// 		'getwid/custom-post-type' => array( //[!]
		// 			'animate',
		// 			'slick',            
		// 			'slick-theme', 
		// 			'magnific-popup', 
		// 		),				
		// 		'getwid/image-hotspot' => array(
		// 			'tippy-themes',                   
		// 		), 
		// 		'getwid/images-slider' => array(
		// 			'slick',            
		// 			'slick-theme',        
		// 		),   
		// 		'getwid/media-text-slider' => array(
		// 			'slick',
		// 			'slick-theme',
		// 			'animate',
		// 		),
		// 		'getwid/post-carousel' => array(
		// 			'slick',
		// 			'slick-theme',
		// 		),    
		// 		'getwid/post-slider' => array(
		// 			'slick',
		// 			'slick-theme',
		// 		),     
		// 		'getwid/section' => array(
		// 			'animate',
		// 			'slick',
		// 			'slick-theme',					
		// 		),        
		// 		'getwid/video-popup' => array(
		// 			'magnific-popup',
		// 		),
		// 	),
		// );
		/* #endregion */

		//Load necessary block JS/CSS
		$blocks_dependency_tree = array(
			'getwid/accordion' => array(
				'js' => array(
					'jquery-ui-accordion'
				),
			),
			'getwid/banner' => array(
				'css' => array(
					'animate',
				),								
			),
			'getwid/icon' => array(
				'css' => array(
					'animate',
				),	
			), 
			'getwid/icon-box' => array(
				'css' => array(
					'animate',
				),	
			),			
			'getwid/circle-progress-bar' => array(
				'js' => array(
					'waypoints',
				),
			),
			'getwid/countdown' => array(
				'js' => array(
					'jquery-plugin',
					'jquery-countdown',
				),
			),
			'getwid/counter' => array(
				'js' => array(
					'waypoints',
					'countup',
				),
			),
			'getwid/custom-post-type' => array( //[!]
				'js' => array(
					// 'slick',
					// 'waypoints',
					// 'countup',		
					// 'popper',            
					// 'tippy',  
					// 'wow',	
					// 'waypoints',
					// 'jquery-plugin',
					// 'jquery-countdown',	
					// 'jquery-ui-accordion',	
					// 'jquery-ui-tabs',	
					// 'magnific-popup',	
				),	
				'css' => array(
					// 'animate',
					// 'slick',            
					// 'slick-theme', 
					// 'magnific-popup', 
				),
			),
			'getwid/image-hotspot' => array(
				'js' => array(
					'popper',            
					'tippy',     
					'waypoints'
				),
				'css' => array(
					'tippy-themes', 
				)
			), 
			'getwid/images-slider' => array(
				'js' => array(
					'slick',  
				),	
				'css' => array(
					'slick',            
					'slick-theme', 
				)			
			),        
			'getwid/media-text-slider' => array(
				'js' => array(
					'slick',
				),		
				'css' => array(
					'slick',
					'slick-theme',
					'animate',
				)
			),
			'getwid/post-carousel' => array(
				'js' => array(
					'slick',
				),		
				'css' => array(
					'slick',            
					'slick-theme', 
				)					
			),
			'getwid/post-slider' => array(
				'js' => array(
					'slick',
				),
				'css' => array(
					'slick',            
					'slick-theme', 
				)					
			),    
			'getwid/progress-bar' => array(
				'js' => array(
					'waypoints',
				),				
			),
			'getwid/section' => array(
				'js' => array(
					'slick',
					'wow',
				),		
				'css' => array(
					'animate',
					'slick',
					'slick-theme',	
				)
			),          
			'getwid/tabs' => array(
				'js' => array(
					'jquery-ui-tabs',
				),				
			),
			'getwid/video-popup' => array(
				'js' => array(
					'magnific-popup',
				),				
				'css' => array(
					'magnific-popup',
				)
			),
		);

		/* #region old */
		if (is_home()){ // is blog
			$current_page_ID = get_option( 'page_for_posts' );

			$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;

			$query = new \WP_Query(array(
				'posts_per_page' => get_option( 'posts_per_page ' ),
				'paged' => $paged
			) );

			$current_page_obj = $query->posts;





		} elseif (is_archive()){  // is archive include (is_category(), is_tag(), is_author(), is_day(), is_month(), is_year(), is_tax())
			$current_page_ID = get_the_ID();
		} elseif (is_single()){
			$current_page_ID = get_the_ID();
			$current_page_obj = get_posts( [ 'include' => [ $current_page_ID ] ] );
		}
		/* #endregion */

		

		

		//$current_page_obj_2 = get_post( $current_page_ID );

		

		var_dump($paged);

		
		
		var_dump( $current_page_obj );
		echo "++++++++++++++++++++++++++++++++++++";
		var_dump( $query->posts );
		exit;

		$this->getwid_enqueue_assets_recursive( $current_page_obj, $blocks_dependency_tree );

		/* #region old */
		// foreach ( $blocks_dependency_tree as $type => $blocks ) {
		// 	if ( $type == 'js' ) {
		// 		foreach ( $blocks as $block_name => $scripts ) {

		// 			$this->getwid_enqueue_assets_recursive( $current_page_obj, $scripts, $block_name );
		// 		}
		// 	} 
		// 	elseif ( $type == 'css' ) {
		// 		foreach ( $blocks as $block_name => $styles ) {
		// 			if (is_home() || is_archive()){ //blog || archive
		// 				foreach ( $current_page_obj as $post_index => $post ) {
		// 					$this->getwid_enqueue_assets_as_required($styles, $block_name, 'css', $post->ID);
		// 				}	
		// 			} else {
		// 				$this->getwid_enqueue_assets_as_required($styles, $block_name, 'css');
		// 			}			
		// 		}
		// 	}
		// }
		/* #endregion */

		wp_enqueue_script(
			"{$this->prefix}-blocks-frontend-js",
			getwid_get_plugin_url( 'assets/js/frontend.blocks.js' ),
			apply_filters(
				'getwid/frontend_blocks_js/dependencies',
				[ 'lodash' ]
			),
			$this->version,
			true
		);

		wp_localize_script(
			"{$this->prefix}-blocks-frontend-js",
			'Getwid',
			apply_filters(
				'getwid/frontend_blocks_js/localize_data',
				[
					'settings'   => [
						'date_time_utc' => current_time( 'Y-m-d H:i:s' ),
						'google_api_key' => get_option( 'getwid_google_api_key', '' )
					],
					'ajax_url' => admin_url( 'admin-ajax.php' ),
					'nonces'   => array(
						'recaptcha_v2_contact_form' => wp_create_nonce( 'getwid_nonce_contact_form' )
					)
				]
			)
		);
	}

	function getwid_enqueue_editor_section_css() {
		add_editor_style( getwid_generate_section_content_width_css() );
	}
}