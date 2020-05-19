(function($){
	$(document).ready(function(e){

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

		window.onYouTubeIframeAPIReady = function () {
			getwid_background_video_youtube.each(function(index){
				let video_id = $(this).attr("id");
				let player = new YT.Player(video_id, {
					playerVars: {
						autoplay: 1, //autoplay
						controls: 0, //hide controls
						disablekb: 1, //disable keyboard
						fs: 0, //disable fullscreen
						cc_load_policy: 0, //disable titles
						iv_load_policy: 3, //disable annotations
						loop: 1, //enable video loop
						modestbranding: 1, //disable logo
						rel: 0, //show related videos
						showinfo: 0, //hide video info
						enablejsapi: 1, //enable events
						mute: 1, //mute sound
					},
					height: '100%',
					width: '100%',
					videoId: video_id,
				});
			});
		};

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_section();
		});

		var getwid_init_section = () => {

			var getwid_background_video_youtube = $('.wp-block-getwid-section__background-video-youtube:not(.getwid-init)');

			//Set IDs to sections
			getwid_background_video_youtube.each(function(index){

				//Add init class
				$(this).addClass('getwid-init');

				let video_id = getYouTubeID($(this).attr('youtube-video-url'));
				$(this).attr("id",video_id);
			});

			if (getwid_background_video_youtube.length){
				if (!$('#youtube_video_api_js').length){
					addYouTubeScript();
				}
			}

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

					getwid_background_slider.slick({
						arrows: false,
						dots: false,
						rows: 0,
						slidesToShow: 1,
						slidesToScroll: 1,
						autoplay: getwid_autoplay,
						autoplaySpeed: getwid_autoplay_speed,
						fade: getwid_fade_effect,
						speed: getwid_slide_speed,
						infinite: getwid_infinite
					});

				});

			});

			if (typeof WOW != 'undefined') {
				var getwid_animated = new WOW({
					boxClass: 'getwid-anim',
					mobile: false
				});

				getwid_animated.init();
			}


			var section = $('.wp-block-getwid-section:not(.getwid-init)');
			section.each(function (index) {

				//Add init class
				$(this).addClass('getwid-init');

				var section = $(this),
					video = section.find('.wp-block-getwid-section__background-video').get(0),
					playbutton = section.find('.getwid-background-video-play'),
					mutebutton = section.find('.getwid-background-video-mute');


				section.find('.wp-block-getwid-section__background-video')
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

		getwid_init_section();

	});
})(jQuery);