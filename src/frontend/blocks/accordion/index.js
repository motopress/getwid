(function($){
	$(document).ready(function(e){

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_accordions();
		});

		var getwid_init_accordions = () => {
			var getwid_accordions = $('.wp-block-getwid-accordion:not(.getwid-init)');

			getwid_accordions.each(function(index, accordion){
				//Add init class
				$(this).addClass('getwid-init');

				const items = $(accordion).find('.wp-block-getwid-accordion-item');
				const all_wrappers = $(accordion).find('.wp-block-getwid-accordion-item__content-wrapper');

				//Set active
				const active = $(accordion).data('active-element');
				$(items).eq(active).addClass('active-accordion');

				//Set height
				if ($(accordion).hasClass('accordion-equal-height')){
					let highestAccordion = 0;
					$(accordion).find('.wp-block-getwid-accordion-item__content').each(function(){
						if($(this).height() > highestAccordion) {
							highestAccordion = $(this).height();
						}
					});
					$(accordion).find('.wp-block-getwid-accordion-item__content').height(highestAccordion);
				}

				//Inner items
				items.each(function(index, item){

					$(item).find('.wp-block-getwid-accordion-item__header a').on('click', (e) => {
						e.preventDefault();

						const current_inner_height = $(item).find('.wp-block-getwid-accordion-item__content').outerHeight(true);
						const current_wrapper = $(item).find('.wp-block-getwid-accordion-item__content-wrapper');

						//Close current
						if ($(item).hasClass('active-accordion')){
							$(current_wrapper).animate(
								{
									opacity: 0,
									height: "0px"
								},
								{
									duration: 300,
									specialEasing: {
										opacity: "linear",
										height: "linear"
									},
									complete: function() {
										$(item).removeClass('active-accordion');
									}
								}
							);

							return;
						}

						//Open current
						$(current_wrapper).animate(
							{
								opacity: 1,
								height: current_inner_height
							},
							{
								duration: 300,
								specialEasing: {
									opacity: "linear",
									height: "linear"
								},
								complete: function() {
									$(item).addClass('active-accordion');
								}
							}
						);

						//Close other
						$(all_wrappers).not(current_wrapper).animate(
							{
								opacity: 0,
								height: "0px"
							},
							{
								duration: 300,
								specialEasing: {
									opacity: "linear",
									height: "linear"
								},
								complete: function() {
									$(items).not(item).removeClass('active-accordion');
								}
							}
						);
					});
				});
			});
		};

		getwid_init_accordions();
	});
})(jQuery);