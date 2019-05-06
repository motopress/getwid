(function($){
    $(document).ready(function(e){
        
		var getwid_posts_sliders = $('.wp-block-getwid-post-carousel .wp-block-getwid-post-carousel__wrapper');
		        
        getwid_posts_sliders.each(function(index){
            
            getwid_post_slider = $(this);

            let {
				sliderSlidesToShowDesktop,
				getwid_slidesToShowLaptop,
				getwid_slidesToShowTablet,
				getwid_slidesToShowMobile,
				getwid_slidesToScroll,
				getwid_autoplay,
				getwid_autoplay_speed,
				getwid_infinite,
				getwid_animation_speed,
				getwid_center_mode,
				getwid_pause_on_hover,
				getwid_arrows,
				getwid_dots,
			} = getwid_post_slider.data('slider-option');

			getwid_pause_on_hover = false;
			getwid_slidesToScroll = parseInt(getwid_slidesToScroll);
			sliderSlidesToShowDesktop = parseInt(sliderSlidesToShowDesktop);
			getwid_slidesToShowLaptop = parseInt(getwid_slidesToShowLaptop);
			getwid_slidesToShowMobile = parseInt(getwid_slidesToShowMobile);
			getwid_slidesToShowTablet = parseInt(getwid_slidesToShowTablet);
			getwid_arrows = getwid_arrows != 'none' ? true : false;
			getwid_dots = getwid_dots != 'none' ? true : false;

            getwid_post_slider.slick({
                arrows: getwid_arrows,
                dots: getwid_dots,
                rows: 0,
                slidesToShow: sliderSlidesToShowDesktop,
                slidesToScroll: getwid_slidesToScroll,
                autoplay: getwid_autoplay,
                autoplaySpeed: getwid_autoplay_speed,
                fade: false,
                speed: getwid_animation_speed,
                infinite: getwid_infinite,
                
                centerMode: getwid_center_mode,
                variableWidth: false,
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