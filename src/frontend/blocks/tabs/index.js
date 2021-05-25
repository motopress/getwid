/*!
 * getwid-tabs
 */

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

				getwid_tabs_active = $(this).data('active-tab');

				const nav_links_wrapper = $(this).find('.wp-block-getwid-tabs__nav-links');

				//Set a links anchor
				$(this).find('.wp-block-getwid-tabs__nav-link').each(function(index, el){
					$(el).find('a').attr('href', `#tab-${tabID}-${index}`);
				});

				//Set content ID
				$(this).find('.wp-block-getwid-tabs__tab-content-wrapper, > .wp-block-getwid-tabs__tab-content').each(function(index, el){
					$(el).attr('id', `tab-${tabID}-${index}`);
				});

				//Move li to ul (make nav)
				const nav_links = $(this).find('.wp-block-getwid-tabs__nav-link');

				nav_links.each( (index, item) => {
					let nav_link_wrapper = $( item ).closest( '.wp-block-getwid-tabs' ).find( '>.wp-block-getwid-tabs__nav-links' );
					$(item).detach();
					nav_link_wrapper.append( item );

					const attrs = { };
					$.each($( item )[0].attributes, (idx, attr) => {
						attrs[attr.nodeName] = attr.nodeValue;
					});

					$( item ).replaceWith(() =>
						$( "<li/>", attrs ).append( $( item ).contents() )
					);
				} );

				$(this).find('.wp-block-getwid-tabs__tab-content-wrapper').eq(getwid_tabs_active).addClass('is-active-tab');

				$(this).tabs({
					active: getwid_tabs_active,
					activate: function( event, ui ) {
						ui.newPanel.closest('.wp-block-getwid-tabs').find('.wp-block-getwid-tabs__tab-content-wrapper').removeClass('is-active-tab');
						ui.newPanel.addClass('is-active-tab');

						// try prevent scroll on tab heading click
						// stop current animation on most suitable elements for possible scrolling animations
						// .stop() - Stop the currently-running animation on the matched elements.
						// .stop(stopAll = false, goToEnd = false)
						// stopAll - animation queue should be cleared or not
						// goToEnd - complete the current animation immediately
						$('html, body').add(window, document).stop();
					},
				});
			});
		};

		getwid_init_tabs();

	});
})(jQuery);
