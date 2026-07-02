/*!
 * getwid-video-popup
 */

(function ($) {
	$(document).ready(function (e) {

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_video_popup();
		});

		var getwid_init_video_popup = () => {
			var getwid_video_popup = $('.wp-block-getwid-video-popup:not(.getwid-init)');

			getwid_video_popup.each(function (index) {

				//Add init class
				$(this).addClass('getwid-init');

				$(this).find('.wp-block-getwid-video-popup__link').mpFancybox({
					baseClass: 'getwid-video-popup'
				});
			});

		};

		getwid_init_video_popup();

	});
})(jQuery);
