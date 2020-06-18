(function ($) {
	$(document).ready(function (e) {

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_toggles();
		});

		var getwid_init_toggles = () => {
			var getwid_toggles = $('.wp-block-getwid-toggle:not(.getwid-init)');

			getwid_toggles.each(function (index, toggle) {
				//Add init class
				$(this).addClass('getwid-init');

				const active_by_default_rows = $(toggle).find('.wp-block-getwid-toggle__row.is-active');
				active_by_default_rows.each(function () {
					const row = $(this);
					setTimeout(function () {
						const content_wrapper = row.find('.wp-block-getwid-toggle__content-wrapper');
						const current_inner_height = row.find('.wp-block-getwid-toggle__content').outerHeight();
						content_wrapper.css({
							height: current_inner_height
						});
					}, 500);
				});

				$(toggle).find('.wp-block-getwid-toggle__row').on('click', '.wp-block-getwid-toggle__header-wrapper', function (e) {
					const row = $(this).parent();
					const content_wrapper = row.find('.wp-block-getwid-toggle__content-wrapper');
					const current_inner_height = row.find('.wp-block-getwid-toggle__content').outerHeight();
					e.preventDefault();

					//Close
					if (row.hasClass('is-active')) {
						row.removeClass('is-active');
						content_wrapper.css({
							height: 0
						});
					} else { //Open
						row.addClass('is-active');
						content_wrapper.css({
							height: current_inner_height
						});
					}
				});
			});
		};

		getwid_init_toggles();
	});
})(jQuery);