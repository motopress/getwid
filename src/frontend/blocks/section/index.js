/*!
 * getwid-section
 */

(function($){
	$(document).ready(function(e) {

		let getwidYT_check = false;

		var getwid_background_video_youtube,
			getwid_background_video_YT = $('.wp-block-getwid-section__background-video.source-youtube .wp-block-getwid-section__background-video-youtube');

		function addYouTubeScript()
		{
		    var script = document.createElement("script");
		    script.type = "text/javascript";
		    script.src =  "https://www.youtube.com/iframe_api";
		    script.id = "youtube_video_api_js";
		    var done = false;
		    document.getElementsByTagName('head')[0].appendChild(script);

		    script.onload = script.onreadystatechange = function() {
		        if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") )
		        {
		            done = true;
					script.onload = script.onreadystatechange = null;
		        }
		    };
		}

		function getYouTubeID(url) {
			var expr = /(?:https?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?\.com\/\S*(?:(?:\/e(?:mbed))?\/v?|(?:watch\?)?(?:\S*?&?vi?\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;
			return (url.match(expr)) ? RegExp.$1 : false;
		}

		window.getwidYT = {
			data : {
				ready : false
			},

			init: function () {
				getwidYT.data.ready = true;

				clearInterval( getwidYT_check );

				getwid_background_video_YT.each( function(index) {
					let video_id = $( this ).attr("id");
					let autoplay = $( this ).parent().attr('youtube-video-autoplay');
					let loop     = $( this ).parent().attr('youtube-video-loop');
					let muted 	 = $( this ).parent().attr('youtube-video-muted');

					var playbutton = $( this ).closest('.wp-block-getwid-section__wrapper').find('.getwid-background-video-controls .getwid-background-video-play');
					var mutebutton = $( this ).closest('.wp-block-getwid-section__wrapper').find('.getwid-background-video-controls .getwid-background-video-mute');

					window.YT.ready( () => {

						let playerVars = {
							playsinline: 1,
							autoplay: (autoplay == 'true' ? 1 : 0), //autoplay
							controls: 0, //hide controls
							disablekb: 1, //disable keyboard
							fs: 0, //disable fullscreen
							cc_load_policy: 0, //disable titles
							iv_load_policy: 3, //disable annotations
							loop: (loop == 'true' ? 1 : 0), //enable video loop
							modestbranding: 1, //disable logo
							rel: 0, //show related videos
							showinfo: 0, //hide video info
							enablejsapi: 1, //enable events
							mute: (muted == 'true' ? 1 : 0), //mute sound
							autohide: 1,
						};

						if ( loop == 'true' ) {
							playerVars['playlist'] = video_id;
						}

						let player = new YT.Player(getwid_background_video_YT[index], { //$('#'+video_id)[index]
							playerVars: playerVars,
							height: '100%',
							width: '100%',
							videoId: video_id,
							events: {
								'onReady': (e) => {
									var player = e.target;

									if (autoplay == 'true') {
										playbutton.html('<i class="getwid-icon getwid-icon-pause"></i>');
									} else if (autoplay == 'false') {
										playbutton.html('<i class="getwid-icon getwid-icon-play"></i>');
									}

									if (muted == 'true') {
										mutebutton.html('<i class="getwid-icon getwid-icon-mute"></i>');
									} else if (muted == 'false') {
										mutebutton.html('<i class="getwid-icon getwid-icon-volume-up"></i>');
									}

									$(playbutton).on('click', function (e) {

										if (autoplay == 'true') {

											player.pauseVideo();

											playbutton.html('<i class="getwid-icon getwid-icon-play"></i>');
											autoplay = 'false';
										} else if (autoplay == 'false') {

											player.playVideo();

											playbutton.html('<i class="getwid-icon getwid-icon-pause"></i>');
											autoplay = 'true';
										}
									});

									$(mutebutton).on('click', function (e) {

										if (muted == 'true') {

											player.unMute();

											mutebutton.html('<i class="getwid-icon getwid-icon-volume-up"></i>');
											muted = 'false';
										} else if (muted == 'false') {

											player.mute();

											mutebutton.html('<i class="getwid-icon getwid-icon-mute"></i>');
											muted = 'true';
										}
									});

									// force autoplay on iOS devices
									if (autoplay == 'true') {
										player.playVideo();
									}

								},
								'onStateChange': (e) => {

									/*
									 * https://developers.google.com/youtube/iframe_api_reference#Events
									 */

									//unstarted
									if (e.data == -1) {
										playbutton.html('<i class="getwid-icon getwid-icon-play"></i>');
										autoplay = 'false';
									}

									//playing
									if (e.data == 1) {
										playbutton.html('<i class="getwid-icon getwid-icon-pause"></i>');
										autoplay = 'true';
									}

									//paused
									if (e.data == 2) {
										playbutton.html('<i class="getwid-icon getwid-icon-play"></i>');
										autoplay = 'false';
									}

									//buffering
									if (e.data == 3) {
										playbutton.html('<i class="getwid-icon getwid-icon-pause"></i>');
										autoplay = 'true';
									}

									//ended
									if (e.data == 0 && loop == 'false') {

										e.target.stopVideo();

										playbutton.html('<i class="getwid-icon getwid-icon-play"></i>');
										autoplay = 'false';
									}
								},
							}
						});
					} );
				} );
			}
		}

		function waitForYouTubePlayerAPI() {
			/*
			 * The world is mine
			 * https://www.youtube.com/watch?v=13EsiCjsssY
			 *
			 */
			if ( typeof window.onYouTubeIframeAPIReady == 'undefined' ) {

				//console.log( 'onYouTubeIframeAPIReady == UNDEFINED' );
				window.onYouTubeIframeAPIReady = () => {
					getwidYT.init();
				};
			} else {
				/*
				 * Alien detected
				 */
				//console.log( 'onYouTubeIframeAPIReady == DEFINED' );
				getwidYT_check = setInterval( () => {
					if ( typeof window.YT !== 'undefined' && window.YT.loaded ) {
						if ( ! getwidYT.ready ) {

							//console.log( 'window.YT.loaded' );
							getwidYT.init();
						}
					}
				});
			}
		}

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_section_youtube();
			getwid_init_section_slider();
			getwid_init_section_animate();
			getwid_init_section_video();
		});

		var getwid_init_section_youtube = () => {
			getwid_background_video_youtube = $('.wp-block-getwid-section__background-video.source-youtube .wp-block-getwid-section__background-video-youtube:not(.getwid-init)');

			//Set IDs to sections
			getwid_background_video_youtube.each(function(index){
				//Add init class
				$(this).addClass('getwid-init');

				let video_id = getYouTubeID($(this).parent().attr('youtube-video-url'));
				$(this).attr("id", video_id);
			});

			if (getwid_background_video_youtube.length){
				if (!$('#youtube_video_api_js').length){
					addYouTubeScript();
					waitForYouTubePlayerAPI();
				}
			}
		};

		var getwid_init_section_slider = () => {

			var getwid_background_sliders = $('.wp-block-getwid-section__background-slider:not(.getwid-init)'),
				getwid_autoplay,
				getwid_autoplay_speed,
				getwid_fade_effect,
				getwid_slide_speed,
				getwid_infinite,
				getwid_background_slider;

			if (!getwid_background_sliders.length) return;
			if (typeof imagesLoaded == 'undefined') return;

			getwid_background_sliders.each(function(index){

				getwid_background_slider = $(this);

				getwid_autoplay = getwid_background_slider.data('autoplay') == true ? true : false;
				getwid_autoplay_speed = parseInt(getwid_background_slider.data('autoplay-speed'));
				getwid_fade_effect = getwid_background_slider.data('slide-effect') == 'fade' ? true : false;
				getwid_slide_speed = parseInt(getwid_background_slider.data('slide-speed'));
				getwid_infinite = getwid_background_slider.data('infinite') == true ? true : false;

				//Add init class
				$(this).addClass('getwid-init');

				getwid_background_slider.imagesLoaded().done( function( instance ) {

					$(instance.elements[0]).slick({
						arrows: false,
						dots: false,
						rows: 0,
						slidesToShow: 1,
						slidesToScroll: 1,
						autoplay: getwid_autoplay,
						autoplaySpeed: getwid_autoplay_speed,
						fade: getwid_fade_effect,
						speed: getwid_slide_speed,
						infinite: getwid_infinite,
						rtl: !!Getwid.isRTL
					});

				});

			});
		};

		var getwid_init_section_animate = () => {

			if (typeof WOW != 'undefined') {
				var getwid_animated = new WOW({
					boxClass: 'getwid-anim',
					mobile: false
				});

				getwid_animated.init();
			}
		};

		var getwid_init_section_video = () => {

			var section = $('.wp-block-getwid-section:not(.getwid-init)');
			section.each(function (index) {

				//Add init class
				$(this).addClass('getwid-init');

				var section = $(this),
					video = section.find('.wp-block-getwid-section__background-video.source-media-library').get(0),
					playbutton = section.find('.getwid-background-video-play'),
					mutebutton = section.find('.getwid-background-video-mute');


				section.find('.wp-block-getwid-section__background-video.source-media-library')
					.on('play', function (event) {

						playbutton.html('<i class="getwid-icon getwid-icon-pause"></i>');

					})
					.on('pause', function (event) {

						playbutton.html('<i class="getwid-icon getwid-icon-play"></i>');

					});


				section.on('click', '.getwid-background-video-play', function ( e ) {

					e.preventDefault();

					if(video){
						!video.paused ? video.pause() : video.play();
					}

				});

				section.ready(function () {

					if(!!video){
						video.paused ?
							playbutton.html('<i class="getwid-icon getwid-icon-play"></i>') :
							playbutton.html('<i class="getwid-icon getwid-icon-pause"></i>');
						video.muted ?
							mutebutton.html('<i class="getwid-icon getwid-icon-mute"></i>'):
							mutebutton.html('<i class="getwid-icon getwid-icon-volume-up"></i>');
					}

				});

				section.on('click', '.getwid-background-video-mute', function ( e ) {

					e.preventDefault();

					if(video){
						video.muted = !video.muted;
						video.muted ?
							mutebutton.html('<i class="getwid-icon getwid-icon-mute"></i>'):
							mutebutton.html('<i class="getwid-icon getwid-icon-volume-up"></i>');
					}

				});

			});
		};

		getwid_init_section_youtube();
		getwid_init_section_slider();
		getwid_init_section_animate();
		getwid_init_section_video();

	});
})(jQuery);
