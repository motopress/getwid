import animate from 'GetwidUtils/animate';

(function($){
	$(document).ready(function(e){

		$('.getwid-anim.wp-block-getwid-icon-box__wrapper').hover(function(){
			animate($(this), {
				animation: $(this).attr('data-animation')
			});
		});

	});
})(jQuery);