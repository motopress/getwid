(function($){
    $(document).ready(function(e){
        
		var getwid_instagram_sliders = $('.wp-block-getwid-instagram .wp-block-getwid-instagram__wrapper');
		        
        getwid_instagram_sliders.each(function(index){
            
            getwid_instagram_slider = $(this);

            let {
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
			} = getwid_instagram_slider.data('slider-option');

			getwid_pause_on_hover = false;
			getwid_fade_effect = getwid_fade_effect == 'fade' ? true : false;
			getwid_slidesToScroll = parseInt(getwid_slidesToScroll);
			getwid_slidesToShow = parseInt(getwid_slidesToShow);
			getwid_slidesToShowLaptop = parseInt(getwid_slidesToShowLaptop);
			getwid_slidesToShowMobile = parseInt(getwid_slidesToShowMobile);
			getwid_slidesToShowTablet = parseInt(getwid_slidesToShowTablet);

            getwid_instagram_slider.slick({
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
                    
        });
        
    });
})(jQuery);