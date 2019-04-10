(function($){
    $(document).ready(function(e){
        
        var getwid_images_sliders = $('.wp-block-getwid-images-slider .wp-block-getwid-images-slider__wrapper'),
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
            getwid_dots;
        
        getwid_images_sliders.each(function(index){
            
            getwid_images_slider = $(this);
            
            getwid_fade_effect = getwid_images_slider.data('effect') == 'fade' ? true : false;
            getwid_slidesToShow = !!getwid_images_slider.data('slides-show') ? parseInt(getwid_images_slider.data('slides-show')) : 1;
            getwid_slidesToShowLaptop = !!getwid_images_slider.data('slides-show-laptop') ? parseInt(getwid_images_slider.data('slides-show-laptop')) : 1;
            getwid_slidesToShowTablet = !!getwid_images_slider.data('slides-show-tablet') ? parseInt(getwid_images_slider.data('slides-show-tablet')) : 1;
            getwid_slidesToShowMobile = !!getwid_images_slider.data('slides-show-mobile') ? parseInt(getwid_images_slider.data('slides-show-mobile')) : 1;
            getwid_slidesToScroll = !!getwid_images_slider.data('slides-scroll') ? parseInt(getwid_images_slider.data('slides-scroll')) : 1;
            getwid_autoplay = getwid_images_slider.data('autoplay') == true ? true : false;
            getwid_autoplay_speed = parseInt(getwid_images_slider.data('autoplay-speed')) ? parseInt(getwid_images_slider.data('autoplay-speed')) : 2000 ;
            getwid_infinite = getwid_images_slider.data('infinite') == true ? true : false;
            getwid_animation_speed = parseInt(getwid_images_slider.data('animation-speed'));
            getwid_center_mode = getwid_images_slider.data('center-mode') == true ? true : false;
            getwid_variable_width = getwid_images_slider.data('variable-width') == true ? true : false;
            getwid_pause_on_hover = getwid_images_slider.data('pause-hover') == true ? true : false;                       
            getwid_arrows = getwid_images_slider.data('arrows') != 'none' ? true : false;
            getwid_dots = getwid_images_slider.data('dots') != 'none' ? true : false;

            getwid_images_slider.slick({
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