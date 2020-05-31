(function($){
	$(document).ready(function(e){

		function makeTabId(length) {
			var result           = '';
			var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			var charactersLength = characters.length;
			for ( var i = 0; i < length; i++ ) {
			   result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result;
		}

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_tabs();
		});

		var getwid_init_tabs = () => {
			var getwid_tabs = $('.wp-block-getwid-tabs:not(.getwid-init)'),
				getwid_tabs_active = 0;

			//Prepare scructure
			getwid_tabs.each(function(index){
				const tabID = makeTabId(5);

				//Add init class
				$(this).addClass('getwid-init');

				//Equal height
				if ($(this).hasClass('tabs-equal-height')){
					let highestTab = 0;
					$(this).find('.wp-block-getwid-tabs-item__content-wrapper').each(function(){
						if($(this).height() > highestTab) {
							highestTab = $(this).height();
						}
					});
					$(this).find('.wp-block-getwid-tabs-item__content-wrapper').height(highestTab);
				}

				const nav_links_wrapper = $(this).find('.wp-block-getwid-tabs__nav-links');

				//Set a links anchor
				$(this).find('.wp-block-getwid-tabs-item__nav-link').each(function(index, el){
					$(el).find('a').attr('href', `#tab-${tabID}-${index}`);
				});

				//Set content ID
				$(this).find('.wp-block-getwid-tabs-item').each(function(index, el){
					$(el).attr('id', `tab-${tabID}-${index}`);
				});

				//Move li to ul (make nav)
				const nav_links = $(this).find('.wp-block-getwid-tabs-item__nav-link').detach();
				$( nav_links_wrapper ).prepend( nav_links );

				$(this).find('.wp-block-getwid-tabs-item').eq(getwid_tabs_active).addClass('is-active-tab');

				$(this).tabs({
					active: getwid_tabs_active,
					activate: function( event, ui ) {
						ui.newPanel.closest('.wp-block-getwid-tabs').find('.wp-block-getwid-tabs-item').removeClass('is-active-tab');
						ui.newPanel.addClass('is-active-tab');
					}
				});
			});
		};

		getwid_init_tabs();

	});
})(jQuery);