import animate from 'GetwidUtils/animate';

(function($){
	$(document).ready(function(e){

		$('.getwid-animated.wp-block-getwid-icon-box__wrapper').hover(function(){
			animate($(this), $(this).attr('data-animation'));
		});

	});
})(jQuery);