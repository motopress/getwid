(function($){
	$(document).ready(function(e){
        var getwid_accordions = $('.wp-block-getwid-accordion'),
            getwid_accordion_active = 0;
         
        getwid_accordions.each(function(index){
            getwid_accordion_active = parseInt($(this).data('active-element'));

            $(this).accordion({
               header: '.wp-block-getwid-accordion__header-wrapper',
               icons: false,
               active: parseInt(getwid_accordion_active, 10)
            });
        });

	});
})(jQuery);