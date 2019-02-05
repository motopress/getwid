import animate from 'GetwidUtils/animate';

(function($){
	$(document).ready(function(e){

		$('.getwid-animation.wp-block-getwid-icon-box').hover(function(){
			animate($(this).find('.wp-block-getwid-icon-box__icon-wrapper'), {
				animation: $(this).attr('data-animation')
			});
		});

	});
})(jQuery);