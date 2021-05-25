/*!
 * getwid-images-slider
 */

(function($){
    $(document).ready(function(e){

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_sliders();
		});

		var getwid_init_sliders = () => {
			var getwid_images_sliders = $('.wp-block-getwid-images-slider:not(.getwid-init) .wp-block-getwid-images-slider__wrapper'),
				getwid_images_slider,
				getwid_fade_effect,
				getwid_slidesToShow,
				getwid_slidesToShowLaptop,
				getwid_slidesToShowTablet,
				getwid_slidesToShowMobile,
				getwid_slidesToScroll,
				getwid_autoplay,
				getwid_autoplay_speed,
				getwid_infinite,
				getwid_animation_speed,
				getwid_center_mode,
				getwid_variable_width,
				getwid_pause_on_hover,
				getwid_arrows,
				getwid_dots,

				getwid_slide_height,
				getwid_reset_on_tablet,
				getwid_reset_on_mobile;

			if (!getwid_images_sliders.length) return;
			if (typeof imagesLoaded == 'undefined') return;

			getwid_images_sliders.each(function(index){

				getwid_images_slider = $(this);

				//Add init class
				getwid_images_slider.closest('.wp-block-getwid-images-slider').addClass('getwid-init');

				getwid_images_slider.imagesLoaded().done( function( instance ) {

					const current_getwid_images_slider = $(instance.elements[0]);

					getwid_fade_effect = current_getwid_images_slider.data('effect') == 'fade' ? true : false;
					getwid_slidesToShow = !!current_getwid_images_slider.data('slides-show') && current_getwid_images_slider.data('effect') == 'slide' ? parseInt(current_getwid_images_slider.data('slides-show')) : 1;
					getwid_slidesToShowLaptop = !!current_getwid_images_slider.data('slides-show-laptop') ? parseInt(current_getwid_images_slider.data('slides-show-laptop')) : 1;
					getwid_slidesToShowTablet = !!current_getwid_images_slider.data('slides-show-tablet') ? parseInt(current_getwid_images_slider.data('slides-show-tablet')) : 1;
					getwid_slidesToShowMobile = !!current_getwid_images_slider.data('slides-show-mobile') ? parseInt(current_getwid_images_slider.data('slides-show-mobile')) : 1;
					getwid_slidesToScroll = !!current_getwid_images_slider.data('slides-scroll') ? parseInt(current_getwid_images_slider.data('slides-scroll')) : 1;
					getwid_autoplay = current_getwid_images_slider.data('autoplay') == true ? true : false;
					getwid_autoplay_speed = parseInt(current_getwid_images_slider.data('autoplay-speed')) ? parseInt(current_getwid_images_slider.data('autoplay-speed')) : 2000 ;
					getwid_infinite = current_getwid_images_slider.data('infinite') == true ? true : false;
					getwid_animation_speed = parseInt(current_getwid_images_slider.data('animation-speed'));
					getwid_center_mode = current_getwid_images_slider.data('center-mode') == true ? true : false;
					getwid_variable_width = current_getwid_images_slider.data('variable-width') == true ? true : false;
					getwid_pause_on_hover = current_getwid_images_slider.data('pause-hover') == true ? true : false;
					getwid_arrows = current_getwid_images_slider.data('arrows') != 'none' ? true : false;
					getwid_dots = current_getwid_images_slider.data('dots') != 'none' ? true : false;

					getwid_slide_height    = current_getwid_images_slider.data('height') ? current_getwid_images_slider.data('height') : undefined;
					getwid_reset_on_tablet = current_getwid_images_slider.data('reset-on-tablet')  ? true : false;
					getwid_reset_on_mobile = current_getwid_images_slider.data('reset-on-mobile')  ? true : false;

					$(instance.elements[0]).slick({
						arrows: getwid_arrows,
						dots: getwid_dots,
						rows: 0,
						slidesToShow: getwid_slidesToShow,
						slidesToScroll: getwid_slidesToScroll,
						autoplay: getwid_autoplay,
						autoplaySpeed: getwid_autoplay_speed,
						fade: getwid_fade_effect,
						speed: getwid_animation_speed,
						infinite: getwid_infinite,

						centerMode: getwid_center_mode,
						variableWidth: getwid_variable_width,
						pauseOnHover: getwid_pause_on_hover,

						adaptiveHeight: true,

						responsive: [
							{
							  breakpoint: 991,
							  settings: {
								slidesToShow: getwid_slidesToShowLaptop,
								slidesToScroll: 1
							  }
							},
							{
							  breakpoint: 768,
							  settings: {
								slidesToShow: getwid_slidesToShowTablet,
								slidesToScroll: 1
							  }
							},
							{
							  breakpoint: 468,
							  settings: {
								slidesToShow: getwid_slidesToShowMobile,
								slidesToScroll: 1
							  }
							}
						  ]

					});

				} );
			});
		};

		getwid_init_sliders();
    });
})(jQuery);
