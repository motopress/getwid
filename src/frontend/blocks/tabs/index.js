(function($){
	$(document).ready(function(e){

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_tabs();
		});

		var getwid_init_tabs = () => {
			var getwid_tabs = $('.wp-block-getwid-tabs:not(.getwid-init)'),
				getwid_tabs_active = 0,
				getwid_tabs_height_style;

			getwid_tabs.each(function(index){

				//Add init class
				$(this).addClass('getwid-init');

				const nav_links_wrapper = $(this).find('.wp-block-getwid-tabs__nav-links');

				const nav_links = $(this).find('.wp-block-getwid-tabs-item__nav-link').detach();


				$( nav_links_wrapper ).prepend( nav_links );

				debugger;




				// getwid_tabs_active = parseInt($(this).data('active-tab'));
				// getwid_tabs_height_style = $(this).data('height-style');

				// $(this).tabs({
				// 	active: getwid_tabs_active,
				// });
			});
		};

		getwid_init_tabs();

	});
})(jQuery);