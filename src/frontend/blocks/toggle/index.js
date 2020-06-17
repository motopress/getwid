(function($){
	$(document).ready(function(e){

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_toggles();
		});

		var getwid_init_toggles = () => {
			var getwid_toggles = $('.wp-block-getwid-toggle:not(.getwid-init)');

			getwid_toggles.each(function(index, toggle){
				//Add init class
				$(this).addClass('getwid-init');

				$(toggle).find('.wp-block-getwid-toggle__row').on('click', function(e){
					const row = $(this);
					const content_wrapper = row.find('.wp-block-getwid-toggle__content-wrapper');
					const current_inner_height = row.find('.wp-block-getwid-toggle__content').outerHeight(true);
					e.preventDefault();

					//Close
					if (row.hasClass('is-active')){
						content_wrapper.animate(
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
								complete: function() {
									row.removeClass('is-active');
								}
							}
						);
					} else { //Open
						content_wrapper.animate(
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
								complete: function() {
									row.addClass('is-active');
								}
							}
						);
					}
				});
			});
		};

		getwid_init_toggles();
	});
})(jQuery);