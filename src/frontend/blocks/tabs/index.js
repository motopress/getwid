(function($){
	$(document).ready(function(e){
		var getwid_tabs = $('.wp-block-getwid-tabs'),
			getwid_tabs_active = 0;

		getwid_tabs.each(function(index){
			getwid_tabs_active = parseInt($(this).data('active-tab'));
			$(this).tabs({
				active: getwid_tabs_active
			});
		});

	});
})(jQuery);