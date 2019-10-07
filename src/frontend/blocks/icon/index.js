import getwid_animate from 'GetwidUtils/animate';

(function($){
	$(document).ready(function(e){

		$('.getwid-animation.wp-block-getwid-icon__wrapper').mouseenter(function(){
			getwid_animate($(this), {
				animation: $(this).attr('data-animation')
			});
		});

	});
})(jQuery);