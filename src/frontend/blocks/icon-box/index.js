( function($){
	$( document ).ready(function(e){

		$('.getwid-animation.wp-block-getwid-icon-box').mouseenter( function() {
			animate($(this).find('.wp-block-getwid-icon-box__icon-wrapper'), {
				animation: $(this).attr('data-animation')
			});
		});

	});
} )( jQuery );