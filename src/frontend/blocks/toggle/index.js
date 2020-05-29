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

				//Set height
				if ($(toggle).hasClass('toggle-equal-height')){
					let highesttoggle = 0;
					$(toggle).find('.wp-block-getwid-toggle-item__content').each(function(){
						if($(this).height() > highesttoggle) {
							highesttoggle = $(this).height();
						}
					});
					$(toggle).find('.wp-block-getwid-toggle-item__content').height(highesttoggle);
				}

				//Init
				$(toggle).accordion({
					header: '.wp-block-getwid-toggle-item__header-wrapper',
					collapsible: true,
					icons: false,
					animate: false,
					heightStyle: 'content',
					create: function( event, ui ) {
						$(toggle).find('.wp-block-getwid-toggle-item__header-wrapper').on('click', function(e){
							const header = $(this);
							const content = $(this).next();
							const current_inner_height = content.find('.wp-block-getwid-toggle-item__content').outerHeight(true);
							e.preventDefault();

							//Close
							if (header.hasClass('is-active-toggle-header')){
								content.animate(
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
											header.removeClass('is-active-toggle-header');
											content.removeClass('is-active-toggle');
										}
									}
								);
							} else { //Open
								content.animate(
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
											header.addClass('is-active-toggle-header');
											content.addClass('is-active-toggle');
										}
									}
								);
							}
						});
					},
					activate: function( event, ui ) {},
					beforeActivate: function( event, ui ) {}
				});
			});
		};

		getwid_init_toggles();
	});
})(jQuery);