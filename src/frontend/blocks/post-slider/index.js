(function($){
	$(document).ready(function(e){
		
		var getwid_posts_sliders = $('.wp-block-getwid-post-slider .wp-block-getwid-post-slider__content');
		
		getwid_posts_sliders.each(function(index){
			
			getwid_post_slider = $(this);
			
			let {
				getwid_fade_effect,
				getwid_autoplay,
				getwid_autoplay_speed,
				getwid_infinite,
				getwid_animation_speed,
				getwid_arrows,
				getwid_dots,
			} = getwid_post_slider.data('slider-option');
			
			getwid_fade_effect = getwid_fade_effect == 'fade' ? true : false;
			getwid_pause_on_hover = false;
			getwid_arrows = getwid_arrows != 'none' ? true : false;
			getwid_dots = getwid_dots != 'none' ? true : false;
			
			getwid_post_slider.slick({
				arrows: getwid_arrows,
				dots: getwid_dots,
				rows: 0,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: getwid_autoplay,
				autoplaySpeed: getwid_autoplay_speed,
				fade: getwid_fade_effect,
				speed: getwid_animation_speed,
				infinite: getwid_infinite,
				
				centerMode: false,
				variableWidth: false,
				pauseOnHover: false,              
				adaptiveHeight: true,                
			}); 
			
		});
		
	});
})(jQuery);