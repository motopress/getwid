import $ from 'jquery';

type GetwidGlobal = {
	isRTL?: boolean;
};

type SlickElement = JQuery< HTMLElement > & {
	slick?: ( options: Record< string, unknown > ) => void;
	imagesLoaded?: () => {
		done: (
			callback: ( instance: { elements: HTMLElement[] } ) => void
		) => void;
	};
};

type WowConstructor = new ( options: Record< string, unknown > ) => {
	init: () => void;
};

type YouTubePlayer = {
	playVideo: () => void;
	pauseVideo: () => void;
	stopVideo: () => void;
	mute: () => void;
	unMute: () => void;
	destroy?: () => void;
};

type YouTubePlayerEvent = {
	target: YouTubePlayer;
	data: number;
};

type YouTubeApi = {
	loaded?: boolean;
	ready: ( callback: () => void ) => void;
	Player: new (
		element: HTMLElement,
		options: {
			playerVars: Record< string, unknown >;
			height: string;
			width: string;
			videoId: string;
			events: {
				onReady: ( event: YouTubePlayerEvent ) => void;
				onStateChange: ( event: YouTubePlayerEvent ) => void;
			};
		}
	) => YouTubePlayer;
};

type GetwidYouTubeRuntime = {
	data: {
		ready: boolean;
	};
	init: () => void;
};

declare global {
	interface Window {
		WOW?: WowConstructor;
		Getwid?: GetwidGlobal;
		YT?: YouTubeApi;
		getwidYT?: GetwidYouTubeRuntime;
		onYouTubeIframeAPIReady?: () => void;
	}
}

const youtubeApiScriptId = 'youtube_video_api_js';
const youtubeSelector =
	'.wp-block-getwid-section__background-video.source-youtube .wp-block-getwid-section__background-video-youtube';

let youtubeApiCheck: ReturnType< typeof setInterval > | undefined;

function setButtonIcon( button: JQuery< HTMLElement >, icon: string ) {
	button.html( `<i class="getwid-icon getwid-icon-${ icon }"></i>` );
}

function addYouTubeScript() {
	if ( document.getElementById( youtubeApiScriptId ) ) {
		return;
	}

	const script = document.createElement( 'script' );
	script.type = 'text/javascript';
	script.src = 'https://www.youtube.com/iframe_api';
	script.id = youtubeApiScriptId;

	document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );
}

function getYouTubeID( url?: string ) {
	if ( ! url ) {
		return false;
	}

	const expr =
		/(?:https?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?\.com\/\S*(?:(?:\/e(?:mbed))?\/v?|(?:watch\?)?(?:\S*?&?vi?\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;
	const match = url.match( expr );

	return match ? match[ 1 ] : false;
}

function initYouTubePlayers() {
	const videos = $( `${ youtubeSelector }:not(.getwid-init)` );

	if ( ! videos.length || ! window.YT ) {
		return;
	}

	videos.each( function () {
		const videoElement = this;
		const video = $( videoElement );
		const videoWrapper = video.parent();
		const videoId = getYouTubeID(
			String( videoWrapper.attr( 'youtube-video-url' ) || '' )
		);

		if ( ! videoId ) {
			return;
		}

		video.addClass( 'getwid-init' );
		video.attr( 'id', videoId );

		let autoplay = String(
			videoWrapper.attr( 'youtube-video-autoplay' ) || 'false'
		);
		const loop = String(
			videoWrapper.attr( 'youtube-video-loop' ) || 'false'
		);
		let muted = String(
			videoWrapper.attr( 'youtube-video-muted' ) || 'false'
		);
		const controls = video
			.closest( '.wp-block-getwid-section__wrapper' )
			.find( '.getwid-background-video-controls' );
		const playButton = controls.find( '.getwid-background-video-play' );
		const muteButton = controls.find( '.getwid-background-video-mute' );

		window.YT?.ready( () => {
			const playerVars: Record< string, unknown > = {
				playsinline: 1,
				autoplay: autoplay === 'true' ? 1 : 0,
				controls: 0,
				disablekb: 1,
				fs: 0,
				cc_load_policy: 0,
				iv_load_policy: 3,
				loop: loop === 'true' ? 1 : 0,
				modestbranding: 1,
				rel: 0,
				showinfo: 0,
				enablejsapi: 1,
				mute: muted === 'true' ? 1 : 0,
				autohide: 1,
			};

			if ( loop === 'true' ) {
				playerVars.playlist = videoId;
			}

			new window.YT!.Player( videoElement, {
				playerVars,
				height: '100%',
				width: '100%',
				videoId,
				events: {
					onReady: ( event ) => {
						const player = event.target;

						setButtonIcon(
							playButton,
							autoplay === 'true' ? 'pause' : 'play'
						);
						setButtonIcon(
							muteButton,
							muted === 'true' ? 'mute' : 'volume-up'
						);

						playButton.on( 'click', ( clickEvent ) => {
							clickEvent.preventDefault();

							if ( autoplay === 'true' ) {
								player.pauseVideo();
								setButtonIcon( playButton, 'play' );
								autoplay = 'false';
								return;
							}

							player.playVideo();
							setButtonIcon( playButton, 'pause' );
							autoplay = 'true';
						} );

						muteButton.on( 'click', ( clickEvent ) => {
							clickEvent.preventDefault();

							if ( muted === 'true' ) {
								player.unMute();
								setButtonIcon( muteButton, 'volume-up' );
								muted = 'false';
								return;
							}

							player.mute();
							setButtonIcon( muteButton, 'mute' );
							muted = 'true';
						} );

						if ( autoplay === 'true' ) {
							player.playVideo();
						}
					},
					onStateChange: ( event ) => {
						if ( event.data === -1 ) {
							setButtonIcon( playButton, 'play' );
							autoplay = 'false';
						}

						if ( event.data === 1 || event.data === 3 ) {
							setButtonIcon( playButton, 'pause' );
							autoplay = 'true';
						}

						if ( event.data === 2 ) {
							setButtonIcon( playButton, 'play' );
							autoplay = 'false';
						}

						if ( event.data === 0 && loop === 'false' ) {
							event.target.stopVideo();
							setButtonIcon( playButton, 'play' );
							autoplay = 'false';
						}
					},
				},
			} );
		} );
	} );
}

function waitForYouTubePlayerAPI() {
	if ( typeof window.onYouTubeIframeAPIReady === 'undefined' ) {
		window.onYouTubeIframeAPIReady = () => {
			window.getwidYT?.init();
		};

		return;
	}

	youtubeApiCheck = setInterval( () => {
		if ( window.YT?.loaded && ! window.getwidYT?.data.ready ) {
			window.getwidYT?.init();
		}
	}, 1 );
}

function initSectionYouTube() {
	const videos = $( `${ youtubeSelector }:not(.getwid-init)` );

	if ( ! videos.length ) {
		return;
	}

	window.getwidYT = {
		data: {
			ready: false,
		},
		init() {
			this.data.ready = true;

			if ( youtubeApiCheck ) {
				clearInterval( youtubeApiCheck );
			}

			initYouTubePlayers();
		},
	};

	if ( window.YT?.Player ) {
		window.getwidYT.init();
		return;
	}

	addYouTubeScript();
	waitForYouTubePlayerAPI();
}

function initBackgroundSliders() {
	const sliders = $(
		'.wp-block-getwid-section__background-slider:not(.getwid-init)'
	);

	if ( ! sliders.length ) {
		return;
	}

	sliders.each( function () {
		const slider = $( this ) as SlickElement;

		if ( typeof slider.imagesLoaded !== 'function' ) {
			return;
		}

		const autoplay = slider.data( 'autoplay' ) === true;
		const autoplaySpeed = parseInt(
			String( slider.data( 'autoplay-speed' ) ),
			10
		);
		const fade = slider.data( 'slide-effect' ) === 'fade';
		const speed = parseInt( String( slider.data( 'slide-speed' ) ), 10 );
		const infinite = slider.data( 'infinite' ) === true;

		slider.addClass( 'getwid-init' );

		slider.imagesLoaded().done( ( instance ) => {
			const sliderElement = $( instance.elements[ 0 ] ) as SlickElement;

			sliderElement.slick?.( {
				arrows: false,
				dots: false,
				rows: 0,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay,
				autoplaySpeed,
				fade,
				speed,
				infinite,
				rtl: !! window.Getwid?.isRTL,
			} );
		} );
	} );
}

function initAnimations() {
	if ( typeof window.WOW === 'function' ) {
		new window.WOW( {
			boxClass: 'getwid-anim',
			mobile: false,
		} ).init();
	}
}

function initMediaVideoControls() {
	$( '.wp-block-getwid-section:not(.getwid-init)' ).each( function () {
		const section = $( this );
		const video = section
			.find(
				'.wp-block-getwid-section__background-video.source-media-library'
			)
			.get( 0 ) as HTMLVideoElement | undefined;

		section.addClass( 'getwid-init' );

		if ( ! video ) {
			return;
		}

		const playButton = section.find( '.getwid-background-video-play' );
		const muteButton = section.find( '.getwid-background-video-mute' );

		function syncControls() {
			setButtonIcon( playButton, video?.paused ? 'play' : 'pause' );
			setButtonIcon( muteButton, video?.muted ? 'mute' : 'volume-up' );
		}

		$( video ).on( 'play', () => {
			setButtonIcon( playButton, 'pause' );
		} );
		$( video ).on( 'pause', () => {
			setButtonIcon( playButton, 'play' );
		} );

		section.on( 'click', '.getwid-background-video-play', ( event ) => {
			event.preventDefault();

			if ( video.paused ) {
				void video.play();
				return;
			}

			video.pause();
		} );

		section.on( 'click', '.getwid-background-video-mute', ( event ) => {
			event.preventDefault();

			video.muted = ! video.muted;
			setButtonIcon( muteButton, video.muted ? 'mute' : 'volume-up' );
		} );

		syncControls();
	} );
}

function initSections() {
	initSectionYouTube();
	initBackgroundSliders();
	initAnimations();
	initMediaVideoControls();
}

$( () => {
	$( document.body ).on( 'post-load', initSections );
	initSections();
} );
