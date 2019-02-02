import animate from 'GetwidUtils/animate';

(function($){
	$(document).ready(function(e){

		$('.getwid-animation.wp-block-getwid-icon-box__icon-wrapper').hover(function(){
			console.log('TEST');
			animate($(this), {
				animation: $(this).attr('data-animation')
			});
		});

	});
})(jQuery);