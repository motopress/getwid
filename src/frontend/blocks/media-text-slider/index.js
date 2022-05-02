/*!
 * getwid-media-text-slider
 */

import getwid_animate from 'GetwidUtils/animate';

(function($){
	$(document).ready(function(e){

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_media_text_slider();
		});

		var getwid_init_media_text_slider = () => {
			const baseClass = 'wp-block-getwid-media-text-slider';

			var getwid_content_sliders = $('.wp-block-getwid-media-text-slider:not(.getwid-init) .wp-block-getwid-media-text-slider__content'),
				getwid_autoplay,
				getwid_pause_autoplay_on_hover,
				getwid_autoplay_speed,
				getwid_fade_effect,
				getwid_slide_speed,
				getwid_infinite,
				getwid_content_slider,
				getwid_use_animation;

			getwid_content_sliders.each(function(index){

				getwid_content_slider = $(this);

				//Add init class
				getwid_content_slider.closest('.wp-block-getwid-media-text-slider').addClass('getwid-init');

				getwid_use_animation = typeof $(this).closest('.wp-block-getwid-media-text-slider').data('animation') != 'undefined';

				getwid_autoplay = getwid_content_slider.data('slide-autoplay') == true ? true : false;
				getwid_pause_autoplay_on_hover = getwid_content_slider.data('slide-pause-on-hover') == true ? true : false;
				getwid_autoplay_speed = parseInt(getwid_content_slider.data('slide-autoplay-speed'));
				getwid_fade_effect = getwid_content_slider.data('slide-effect') == 'fade' ? true : false;
				getwid_slide_speed = parseInt(getwid_content_slider.data('slide-speed'));
				getwid_infinite = getwid_content_slider.data('infinite') == true ? true : false;

				if (getwid_use_animation){
					$(this).find('.wp-block-getwid-media-text-slider-slide .wp-block-getwid-media-text-slider-slide-content__content').css('opacity', '0');
				}

				getwid_content_slider.on('init', function(){
					if (getwid_use_animation){
						$(this)
							.find('.wp-block-getwid-media-text-slider-slide.slick-active .wp-block-getwid-media-text-slider-slide-content__content')
							.css('opacity', '1');
					}
				});

				var the_same_slide = false;

				//Fix the same slide change when drag or swipe
				getwid_content_slider.on('beforeChange', function(e, slick, currentSlide, nextSlide){
					the_same_slide = (currentSlide == nextSlide);
				});

				getwid_content_slider.on('afterChange', function(e, slick, currentSlide){

					if (!the_same_slide){
						if (getwid_use_animation){
							$(this).find('.wp-block-getwid-media-text-slider-slide .wp-block-getwid-media-text-slider-slide-content__content').css('opacity', '0');
						}

						var next_slide_content = $(this).find('.wp-block-getwid-media-text-slider-slide[data-slick-index="' + currentSlide + '"]').find('.wp-block-getwid-media-text-slider-slide-content__content');

						if (getwid_use_animation && next_slide_content.length){

							getwid_animate(next_slide_content, {
								animation: $(this).closest('.wp-block-getwid-media-text-slider').data('animation'),
								duration: $(this).closest('.wp-block-getwid-media-text-slider').data('duration'),
								delay: $(this).closest('.wp-block-getwid-media-text-slider').data('delay'),
							}, next_slide_content.css('opacity', '1'));
						}
					}
				});

				const $slider = $( this ).closest( `.${baseClass}` );

				const isAvalibleArrow = $slider.hasClass( 'has-arrows-none' ) ? false : true;
				const isAvalibleDots  = $slider.hasClass( 'has-dots-none'   ) ? false : true;

				getwid_content_slider.slick({
					rows: 0,
					slidesToShow: 1,
					slidesToScroll: 1,
					autoplay: getwid_autoplay,
					pauseOnHover: getwid_pause_autoplay_on_hover,
					autoplaySpeed: getwid_autoplay_speed,
					fade: getwid_fade_effect,
					speed: getwid_slide_speed,
					infinite: getwid_infinite,
					arrows: isAvalibleArrow,
					dots  : isAvalibleDots,
					rtl: !!Getwid.isRTL ?? false
				});
			});
		};

		getwid_init_media_text_slider();

	});
})( jQuery );
