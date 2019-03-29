import animate from 'GetwidUtils/animate';

(function($){
	$(document).ready(function(e){

		$('.getwid-animation.wp-block-getwid-image-box').mouseenter(function(){
			animate($(this).find('.wp-block-getwid-image-box__image-wrapper'), {
				animation: $(this).attr('data-animation')
			});
		});

	});
})(jQuery);