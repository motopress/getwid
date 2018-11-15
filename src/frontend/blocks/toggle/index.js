(function($){
	$(document).ready(function(e){
        var getwid_toggles = $('.wp-block-getwid-toggle'),
            getwid_toggle_active = 0;
         
        getwid_toggles.each(function(index){
            getwid_toggle_active = parseInt($(this).data('active-element'));

            var active_row = $(this).find('.wp-block-getwid-toggle__row').eq(parseInt(getwid_toggle_active, 10));
            active_row.addClass('wp-block-getwid-toggle__row--active');
            active_row.find('.wp-block-getwid-toggle__content').slideDown();

            $(this).on('click', '.wp-block-getwid-toggle__header', function(e){
                e.preventDefault();
                var row = $(this).parent();
                row.find('.wp-block-getwid-toggle__content').slideToggle( 400, function() {
                    row.toggleClass('wp-block-getwid-toggle__row--active');
                });
            });

        });

	});
})(jQuery);