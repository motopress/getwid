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

		if (typeof WOW != 'undefined') {
			var getwid_animated = new WOW({
				boxClass: 'getwid-anim',
				mobile: false
			});
	
			getwid_animated.init();
		}
	});

	var section = $('.wp-block-getwid-section');


	section.each(function (index) {

		var section = $(this),
			video = section.find('.wp-block-getwid-section__background-video').get(0),
			playbutton = section.find('.getwid-background-video-play'),
			mutebutton = section.find('.getwid-background-video-mute');


		section.find('.wp-block-getwid-section__background-video')
			.on('play', function (event) {

				playbutton.html('<i class="getwid-icon getwid-icon-pause"></i>');

			})
			.on('pause', function (event) {

				playbutton.html('<i class="getwid-icon getwid-icon-play"></i>');

			});

		section.on('click', '.getwid-background-video-play', function ( e ) {

			e.preventDefault();

			if(video){
				!video.paused ? video.pause() : video.play();
			}

		});

		section.ready(function () {

			if(!!video){
				video.paused ?
					playbutton.html('<i class="getwid-icon getwid-icon-play"></i>') :
					playbutton.html('<i class="getwid-icon getwid-icon-pause"></i>');
				video.muted ?
					mutebutton.html('<i class="getwid-icon getwid-icon-mute"></i>'):
					mutebutton.html('<i class="getwid-icon getwid-icon-volume-up"></i>');
			}

		});

		section.on('click', '.getwid-background-video-mute', function ( e ) {

			e.preventDefault();

			if(video){
				video.muted = !video.muted;
				video.muted ?
					mutebutton.html('<i class="getwid-icon getwid-icon-mute"></i>'):
					mutebutton.html('<i class="getwid-icon getwid-icon-volume-up"></i>');
			}

		});

	});


})(jQuery);