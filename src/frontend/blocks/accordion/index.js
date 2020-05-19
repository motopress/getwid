(function($){
	$(document).ready(function(e){

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_accordions();
		});

		var getwid_init_accordions = () => {
			var getwid_accordions = $('.wp-block-getwid-accordion:not(.getwid-init)'),
				getwid_accordion_active = 0;

			getwid_accordions.each(function(index){
				getwid_accordion_active = parseInt($(this).data('active-element'));

				//Add init class
				$(this).addClass('getwid-init');

				$(this).accordion({
					header: '.wp-block-getwid-accordion__header-wrapper',
					icons: false,
					active: parseInt(getwid_accordion_active, 10),
					heightStyle: 'content'
				});
			});
		};

		getwid_init_accordions();
	});
})(jQuery);
