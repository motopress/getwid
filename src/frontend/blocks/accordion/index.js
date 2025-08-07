/*!
 * getwid-accordion
 */

(function ($) {
	$(document).ready(function (e) {

		var getwid_window_hook = false;

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_accordions();
		});

		var getwid_init_accordions = () => {
			if( getwid_window_hook === false && $('.wp-block-getwid-accordion').length > 0 ) {
				getwid_window_hook = true;

				$(window).on('hashchange', function (e) {
					if (window.location.hash) {
						$('.wp-block-getwid-accordion.getwid-init .wp-block-getwid-accordion__header-wrapper' + window.location.hash).each(function (index, row) {
							var $row = $(row);

							if ( ! $row.hasClass('ui-accordion-header-active') ) {
								$row.trigger('click');
							}
						});
					}
				});
			}

			var getwid_accordions = $('.wp-block-getwid-accordion:not(.getwid-init)'),
				getwid_accordion_active = 0;

			getwid_accordions.each(function (index, accordion) {
				//Add init class
				$(this).addClass('getwid-init');

				if ($(this).data('active-element') != 'none') {
					getwid_accordion_active = parseInt($(this).data('active-element'), 10);
				} else {
					getwid_accordion_active = false;
				}

				//Init
				$(accordion).accordion({
					icons: false,
					animate: false,
					collapsible: true,
					active: getwid_accordion_active,
					heightStyle: 'content',
					create: function (event, ui) {},
					activate: function (event, ui) {
						if (ui.newPanel.length) {
							const newPanelHeight = ui.newPanel.find('.wp-block-getwid-accordion__content').outerHeight(true);
							if (newPanelHeight) {
								$(ui.newPanel).animate(
									{
										height: newPanelHeight,
									},
									{
										queue: false,
										duration: 500,
										complete: function () {
											$(this).css('height', '');
										}
									});
							}
						}

						if (ui.oldPanel.length) {
							const oldPanelHeight = ui.oldPanel.find('.wp-block-getwid-accordion__content').outerHeight(true);
							if (oldPanelHeight) {
								$(ui.oldPanel).css('height', oldPanelHeight);
								$(ui.oldPanel).animate(
									{
										height: 0
									},
									{
										queue: false,
										duration: 500,
										complete: function () {
											$(this).css('height', '');
										}
									});
							}
						}
					}
				});
			});
		};

		getwid_init_accordions();
	});
})(jQuery);
