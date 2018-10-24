import animate from '../../../utils/animate';

(function($){
	$(document).ready(function(e){

		$('.getwid-animated.wp-block-getwid-icon__wrapper').hover(function(){
			animate($(this), $(this).attr('data-animation'));
		});

	});
})(jQuery);