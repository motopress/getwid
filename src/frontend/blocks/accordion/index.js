(function($){
	$(document).ready(function(e){

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_accordions();
		});

		var getwid_init_accordions = () => {
			var getwid_accordions = $('.wp-block-getwid-accordion:not(.getwid-init)'),
				getwid_accordion_active = 0;

			getwid_accordions.each(function(index, accordion){
				//Add init class
				$(this).addClass('getwid-init');

				getwid_accordion_active = parseInt($(this).data('active-element'));

				$(accordion).find('.wp-block-getwid-accordion__content-wrapper').eq(getwid_accordion_active).addClass('is-active-accordion');

				//Init
				$(accordion).accordion({
					header: '.wp-block-getwid-accordion__header-wrapper',
					collapsible: true,
					icons: false,
					animate: false,
					active: parseInt(getwid_accordion_active, 10),
					heightStyle: 'content',
					activate: function( event, ui ) {
						$(accordion).find('.wp-block-getwid-accordion__content-wrapper').removeClass('is-active-accordion');
					},
					beforeActivate: function( event, ui ) {

						//Close current
						if (ui.oldPanel.length){
							$(ui.oldPanel).animate(
								{
									opacity: 0,
									height: "0px"
								},
								{
									duration: 10,
									specialEasing: {
										opacity: "linear",
										height: "linear"
									},
									complete: function() {}
								}
							);
						}

						//Open new, close current
						if (ui.oldPanel.length && ui.newPanel.length){
							$(ui.oldPanel).animate(
								{
									opacity: 0,
									height: "0px"
								},
								{
									duration: 10,
									specialEasing: {
										opacity: "linear",
										height: "linear"
									},
									complete: function() {}
								}
							);

							const current_inner_height = ui.newPanel.find('.wp-block-getwid-accordion__content').outerHeight(true);
							$(ui.newPanel).animate(
								{
									opacity: 1,
									height: current_inner_height
								},
								{
									duration: 10,
									specialEasing: {
										opacity: "linear",
										height: "linear"
									},
									complete: function() {}
								}
							);
						}

						//Open closed
						if (ui.newPanel.length){
							const current_inner_height = ui.newPanel.find('.wp-block-getwid-accordion__content').outerHeight(true);
							$(ui.newPanel).animate(
								{
									opacity: 1,
									height: current_inner_height
								},
								{
									duration: 10,
									specialEasing: {
										opacity: "linear",
										height: "linear"
									},
									complete: function() {}
								}
							);
						}
					}
				});
			});
		};

		getwid_init_accordions();
	});
})(jQuery);