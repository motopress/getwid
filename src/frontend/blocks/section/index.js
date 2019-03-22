(function($){
	$(document).ready(function(e){

		var getwid_background_sliders = $('.wp-block-getwid-section__background-slider'),
			getwid_autoplay,
			getwid_autoplay_speed,
			getwid_fade_effect,
			getwid_slide_speed,
			getwid_infinite,
			getwid_background_slider;

		getwid_background_sliders.each(function(index){

			getwid_background_slider = $(this);

			getwid_autoplay = getwid_background_slider.data('autoplay') == true ? true : false;
			getwid_autoplay_speed = parseInt(getwid_background_slider.data('autoplay-speed'));
			getwid_fade_effect = getwid_background_slider.data('slide-effect') == 'fade' ? true : false;
			getwid_slide_speed = parseInt(getwid_background_slider.data('slide-speed'));
			getwid_infinite = getwid_background_slider.data('infinite') == true ? true : false;

			getwid_background_slider.slick({
				arrows: false,
				dots: false,
				rows: 0,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: getwid_autoplay,
				autoplaySpeed: getwid_autoplay_speed,
				fade: getwid_fade_effect,
				speed: getwid_slide_speed,
				infinite: getwid_infinite
			});
		});


		var getwid_animated = new WOW({
			boxClass: 'getwid-anim',
			mobile: false
		});

		getwid_animated.init();

	});

	var section = $('.wp-block-getwid-section');


	section.each(function (index) {

		var section = $(this),
			video = section.find('.wp-block-getwid-section__background-video').get(0),
			playbutton = section.find('.getwid-background-video-controls');

		section.on('click', '.getwid-background-video-controls', function ( e ) {

			e.preventDefault();

			if(video){
				!video.paused ? video.pause() : video.play();
			}

		});
		section.find('.wp-block-getwid-section__background-video')
			.on('play', function (event) {

				playbutton.html('<i class="far fa-pause-circle"></i>');

			})
			.on('pause', function (event) {

				playbutton.html('<i class="far fa-play-circle"></i>');

			});

	});


})(jQuery);