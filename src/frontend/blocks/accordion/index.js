(function($){
	$(document).ready(function(e){
        var getwid_accordions = $('.wp-block-getwid-accordion'),
            getwid_accordion_active = 0,
            getwid_accordion_height_style;
         
        getwid_accordions.each(function(index){
            getwid_accordion_active = parseInt($(this).data('active-element'));
            getwid_accordion_height_style = $(this).data('height-style');

            $(this).accordion({
               header: '.wp-block-getwid-accordion__header',
               icons: false,
               heightStyle: getwid_accordion_height_style,
               active: parseInt(getwid_accordion_active, 10)
            });
        });

	});
})(jQuery);