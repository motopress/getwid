/*!
 * getwid-toggle
 */

(function ($) {
	$(document).ready(function (e) {

		var getwid_window_hook = false;

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_toggles();
		});

		var getwid_init_toggles = () => {
			if( getwid_window_hook === false && $('.wp-block-getwid-toggle').length > 0 ) {
				getwid_window_hook = true;

				$(window).on('hashchange', function (e) {
					if (window.location.hash) {
						$('.wp-block-getwid-toggle.getwid-init .wp-block-getwid-toggle__row' + window.location.hash).each(function (index, row) {
							var $row = $(row);

							if ( ! $row.hasClass('is-active') ) {
								$row.find('.wp-block-getwid-toggle__header-wrapper').trigger('click');
							}
						});
					}
				});
			}

			var getwid_toggles = $('.wp-block-getwid-toggle:not(.getwid-init)');

			getwid_toggles.each(function (index, toggle) {
				//Add init class
				$(this).addClass('getwid-init');

				$(toggle).find('.wp-block-getwid-toggle__row .wp-block-getwid-toggle__header-wrapper').on('click', function (e) {
					e.preventDefault();
					e.stopImmediatePropagation();

					const row = $(this).parent();
					const content_wrapper = row.find('.wp-block-getwid-toggle__content-wrapper').first();
					const height = row.find('.wp-block-getwid-toggle__content').first().outerHeight(true);

					//Close
					if (row.hasClass('is-active')) {
						row.removeClass('is-active');
						content_wrapper.css('height', height);
						$(content_wrapper).animate(
							{
								height: 0,
							},
							{
								queue: false,
								duration: 500,
								complete: function () {
									$(this).css('height', '');
								}
							});
					} else { //Open
						$(content_wrapper).animate(
							{
								height: height,
							},
							{
								queue: false,
								duration: 500,
								complete: function () {
									$(this).css('height', '');
								}
							});
						row.addClass('is-active');
					}
				});

				if (window.location.hash) {
					$(window).trigger('hashchange');
				}
			});
		};

		getwid_init_toggles();
	});
})(jQuery);
