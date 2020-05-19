import getwid_animate from 'GetwidUtils/animate';

( function($){
	$( document ).ready(function(e){

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_icon_box();
		});

		var getwid_init_icon_box = () => {
			var getwid_icons = $('.wp-block-getwid-icon-box:not(.getwid-init)');

			getwid_icons.each(function(i, el){

				//Add init class
				$(el).addClass('getwid-init');

				$('.getwid-animation.wp-block-getwid-icon-box').mouseenter( function() {
					getwid_animate($(this).find('.wp-block-getwid-icon-box__icon-wrapper'), {
						animation: $(this).attr('data-animation')
					});
				});

			});
		};

		getwid_init_icon_box();

	});
} )( jQuery );
