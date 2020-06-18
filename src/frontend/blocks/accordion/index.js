(function ($) {
	$(document).ready(function (e) {

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_accordions();
		});

		var getwid_init_accordions = () => {
			var getwid_accordions = $('.wp-block-getwid-accordion:not(.getwid-init)'),
				getwid_accordion_active = 0;

			getwid_accordions.each(function (index, accordion) {
				//Add init class
				$(this).addClass('getwid-init');

				if ($(this).data('active-element') !='none' ){
					getwid_accordion_active = parseInt($(this).data('active-element'), 10);
				} else {
					getwid_accordion_active = false;
				}


				//Init
				$(accordion).accordion({
					header: '.wp-block-getwid-accordion__header-wrapper',
					icons: false,
					animate: false,
					active: getwid_accordion_active,
					heightStyle: 'content',
					create: function (event, ui) {
						if (ui.panel.length) {
							setTimeout(function () {
								const current_inner_height = ui.panel.find('.wp-block-getwid-accordion__content').outerHeight();
								$(ui.panel).css({
									height: current_inner_height
								});
							}, 500);

						}
					},
					activate: function (event, ui) {},
					beforeActivate: function (event, ui) {
						//Close current
						if (ui.oldPanel.length) {
							$(ui.oldPanel).css({
								height: 0
							});
						}

						//Open closed
						if (ui.newPanel.length) {
							const current_inner_height = ui.newPanel.find('.wp-block-getwid-accordion__content').outerHeight();
							$(ui.newPanel).css({
								height: current_inner_height
							});
						}
					}
				});
			});
		};

		getwid_init_accordions();
	});
})(jQuery);