/*!
 * getwid-icon
 */

import getwid_animate from 'GetwidUtils/animate';

(function($){
	$(document).ready(function(e){

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_icon();
		});

		var getwid_init_icon = () => {
			var getwid_icons = $('.wp-block-getwid-icon:not(.getwid-init)');

			getwid_icons.each(function(i, el){

				//Add init class
				$(el).addClass('getwid-init');

				$('.getwid-animation.wp-block-getwid-icon__wrapper').on( 'mouseenter', function(){
					getwid_animate($(this), {
						animation: $(this).attr('data-animation')
					});
				});

			});
		};

		getwid_init_icon();

	});
})(jQuery);
