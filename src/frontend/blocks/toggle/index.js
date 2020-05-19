(function($){
	$(document).ready(function(e){

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_toggles();
		});

		var getwid_init_toggles = () => {
			var getwid_toggles = $('.wp-block-getwid-toggle:not(.getwid-init)'),
				getwid_toggle_active = 0;
			/**
			 *
			 * @todo fix all active tabs
			 *
			 */
			getwid_toggles.each(function(index){

				//Add init class
				$(this).addClass('getwid-init');

				if ($(this).data('active-element') == 'all'){
					getwid_toggle_active = 'all';
					$(this).find('.wp-block-getwid-toggle__row').addClass('is-active');
					$(this).find('.wp-block-getwid-toggle__content').slideDown();
				} else {
					getwid_toggle_active = parseInt($(this).data('active-element'), 10);
					var active_row = $(this).find('.wp-block-getwid-toggle__row').eq(getwid_toggle_active);
					active_row.addClass('is-active');
					active_row.find('.wp-block-getwid-toggle__content').slideDown();
				}

				$(this).on('click', '.wp-block-getwid-toggle__header-wrapper', function(e){
					e.preventDefault();
					var row = $(this).parent();
					row.toggleClass('is-active');
					row.find('.wp-block-getwid-toggle__content').slideToggle( 400 );
				});

			});
		};

		getwid_init_toggles();

	});
})(jQuery);