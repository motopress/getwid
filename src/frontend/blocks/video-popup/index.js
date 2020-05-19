(function ($) {
	$(document).ready(function (e) {

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_video_popup();
		});

		var getwid_init_video_popup = () => {
			var getwid_video_popup = $('.wp-block-getwid-video-popup:not(.getwid-init)');

			getwid_video_popup.each(function (index) {

				//Add init class
				$(this).addClass('getwid-init');

				$(this).find('.wp-block-getwid-video-popup__link').magnificPopup({
					mainClass: 'getwid-video-popup',
					type: 'iframe',
					iframe: {
						patterns: {
							youtube: {
								index: 'youtu', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).
								id: function (url) {
									if (url.indexOf('youtube.com/') != -1) { //Full
										var link = url.match(/v=(.+)(\&|$)/);
										if (link[1] !== undefined) {
											return link[1];
										}
									}

									if (url.indexOf('youtu.be/') != -1) { //Short
										var link_short = url.match(/be\/(.+)(\?|$)/);
										if (link_short[1] !== undefined) {
											return link_short[1];
										}
									}
								},
								src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
							},
							vimeo: {
								index: 'vimeo.com/',
								id: '/',
								src: '//player.vimeo.com/video/%id%?autoplay=1'
							},
							dailymotion: {
								index: 'dailymotion.com',
								id: function (url) {
									var m = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
									if (m !== null) {
										if (m[4] !== undefined) {

											return m[4];
										}
										return m[2];
									}
									return null;
								},
								src: 'https://www.dailymotion.com/embed/video/%id%'
							}
						}
					}
				});
			});
		};

		getwid_init_video_popup();

	});
})(jQuery);