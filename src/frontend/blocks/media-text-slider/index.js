import animate from 'GetwidUtils/animate';

(function($){
	$(document).ready(function(e){

        var getwid_content_sliders = $('.wp-block-getwid-media-text-slider .wp-block-getwid-media-text-slider__content'),
            getwid_autoplay,
            getwid_autoplay_speed,
            getwid_fade_effect,
            getwid_slide_speed,
            getwid_infinite,
            getwid_arrows,
            getwid_dots,
            getwid_content_slider;
        
        getwid_content_sliders.each(function(index){
            
            getwid_content_slider = $(this);
            
            getwid_autoplay = getwid_content_slider.data('slide-autoplay') == true ? true : false;
            getwid_autoplay_speed = parseInt(getwid_content_slider.data('slide-autoplay-speed'));
            getwid_fade_effect = getwid_content_slider.data('slide-effect') == 'fade' ? true : false;
            getwid_slide_speed = parseInt(getwid_content_slider.data('slide-speed'));
            getwid_infinite = getwid_content_slider.data('infinite') == true ? true : false;
            getwid_arrows = getwid_content_slider.data('slide-arrows') == true ? true : false;
            getwid_dots = getwid_content_slider.data('slide-dots') == true ? true : false;
            
/*            getwid_nav_slider = getwid_content_slider.next('.wp-block-getwid-content-slider__nav-slider').find('.wp-block-getwid-content-slider__nav-slider-wrapper');
                        
            if(getwid_nav_slider.length != 0){
                
               var getwid_nav_slider_slidesToShow = parseInt(getwid_nav_slider.data('slides-to-show')),
                   getwid_nav_slider_arrows = getwid_nav_slider.data('arrows') == true ? true : false;
                
                getwid_nav_slider.slick({
                    slidesToShow: getwid_nav_slider_slidesToShow,
                    slidesToScroll: 1,
                    asNavFor: getwid_content_slider,
                    dots: false,
                    arrows: getwid_nav_slider_arrows,
                    centerMode: true,
                    focusOnSelect: true,
                    infinite: true,
                    rows: 0,
                    responsive: [
                        {
                          breakpoint: 991,
                          settings: {
                            slidesToShow: 5,
                          }
                        },
                        {
                          breakpoint: 768,
                          settings: {
                            slidesToShow: 1
                          }
                        }
                      ]
                });
                
            }else{
                getwid_nav_slider = false;
            };*/
            
            getwid_content_slider.on('init', function(){

                if (getwid_infinite){
                    var first_slide_content = $(this).find('.wp-block-getwid-media-text-slider-slide__content-wrapper').eq(1).find('.wp-block-getwid-media-text-slider-slide-content__content'); 
                } else {
                    var first_slide_content = $(this).find('.wp-block-getwid-media-text-slider-slide__content-wrapper').first().find('.wp-block-getwid-media-text-slider-slide-content__content');
                }                    

                if(first_slide_content.length){
                    animate(first_slide_content, {
                        animation: $(this).closest('.wp-block-getwid-media-text-slider').data('animation'),
                        duration: $(this).closest('.wp-block-getwid-media-text-slider').data('duration'),
                        delay: $(this).closest('.wp-block-getwid-media-text-slider').data('delay'),
                    });
                }
                
            });
            
            getwid_content_slider.on('beforeChange', function(e, slick, currentSlide, nextSlide){

                var next_slide_content = $(this).find('.wp-block-getwid-media-text-slider-slide[data-slick-index="' + nextSlide + '"]').find('.wp-block-getwid-media-text-slider-slide-content__content');
                
                if(next_slide_content.length){
                    animate(next_slide_content, {
                        animation: $(this).closest('.wp-block-getwid-media-text-slider').data('animation'),
                        duration: $(this).closest('.wp-block-getwid-media-text-slider').data('duration'),
                        delay: $(this).closest('.wp-block-getwid-media-text-slider').data('delay'),
                    });
                }
                
            });
            
            getwid_content_slider.slick({
                arrows: true,
                dots: true,
                rows: 0,
                slidesToShow: 1,
                slidesToScroll: 1,
                // autoplay: false,
                autoplay: getwid_autoplay,
                autoplaySpeed: getwid_autoplay_speed,
                fade: getwid_fade_effect,
                speed: getwid_slide_speed,
                infinite: getwid_infinite,
                // asNavFor: getwid_nav_slider,
            });     
        });        

	});
})(jQuery);