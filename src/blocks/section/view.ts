import $ from 'jquery';

type GetwidGlobal = {
	isRTL?: boolean;
};

type SlickElement = JQuery< HTMLElement > & {
	slick?: ( options: Record< string, unknown > ) => void;
	imagesLoaded?: () => { done: ( callback: () => void ) => void };
};

type WowConstructor = new ( options: Record< string, unknown > ) => {
	init: () => void;
};

declare global {
	interface Window {
		WOW?: WowConstructor;
		Getwid?: GetwidGlobal;
	}
}

function initBackgroundSliders() {
	const sliders = $(
		'.wp-block-getwid-section__background-slider:not(.getwid-init)'
	);

	sliders.each( function () {
		const slider = $( this ) as SlickElement;
		const run = () => {
			slider.addClass( 'getwid-init' );
			slider.slick?.( {
				arrows: false,
				dots: false,
				rows: 0,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: Boolean( slider.data( 'autoplay' ) ),
				autoplaySpeed:
					parseInt( String( slider.data( 'autoplay-speed' ) ), 10 ) ||
					100,
				fade: slider.data( 'slide-effect' ) === 'fade',
				speed:
					parseInt( String( slider.data( 'slide-speed' ) ), 10 ) ||
					100,
				infinite: Boolean( slider.data( 'infinite' ) ),
				rtl: !! window.Getwid?.isRTL,
			} );
		};

		if ( typeof slider.imagesLoaded === 'function' ) {
			slider.imagesLoaded().done( run );
		} else {
			run();
		}
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
		const play = section.find( '.getwid-background-video-play' );
		const mute = section.find( '.getwid-background-video-mute' );

		section.addClass( 'getwid-init' );

		if ( ! video ) {
			return;
		}

		function syncControls() {
			play.html(
				video?.paused
					? '<i class="getwid-icon getwid-icon-play"></i>'
					: '<i class="getwid-icon getwid-icon-pause"></i>'
			);
			mute.html(
				video?.muted
					? '<i class="getwid-icon getwid-icon-mute"></i>'
					: '<i class="getwid-icon getwid-icon-volume-up"></i>'
			);
		}

		$( video ).on( 'play pause', syncControls );
		section.on( 'click', '.getwid-background-video-play', ( event ) => {
			event.preventDefault();

			if ( video.paused ) {
				void video.play();
			} else {
				video.pause();
			}
		} );
		section.on( 'click', '.getwid-background-video-mute', ( event ) => {
			event.preventDefault();
			video.muted = ! video.muted;
			syncControls();
		} );
		syncControls();
	} );
}

function initSections() {
	initBackgroundSliders();
	initAnimations();
	initMediaVideoControls();
}

$( () => {
	$( document.body ).on( 'post-load', initSections );
	initSections();
} );
