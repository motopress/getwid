import $ from 'jquery';

type GetwidSliderGlobal = {
	isRTL?: boolean;
};

type SlickElement = JQuery< HTMLElement > & {
	slick: ( options: Record< string, unknown > ) => void;
};

function getAnimationEndEvent() {
	const elementStyle = document.createElement( 'div' ).style;
	const events = {
		animation: 'animationend',
		OAnimation: 'oAnimationEnd',
		MozAnimation: 'mozAnimationEnd',
		WebkitAnimation: 'webkitAnimationEnd',
	};

	for ( const key in events ) {
		if ( key in elementStyle ) {
			return events[ key as keyof typeof events ];
		}
	}

	return 'animationend';
}

function animateElement(
	element: JQuery< HTMLElement >,
	settings: {
		animation?: string;
		duration?: string;
		delay?: string;
	}
) {
	const animation = settings.animation || '';
	const animationEndEvent = getAnimationEndEvent();

	element.css( {
		'animation-duration': settings.duration || '1s',
		'animation-delay': settings.delay || '0s',
		'-webkit-animation-delay': settings.delay || '0s',
	} );

	element
		.addClass( `animated ${ animation }` )
		.one( animationEndEvent, function () {
			$( this ).removeClass( `animated ${ animation }` );
		} );
}

function parseNumberData( element: JQuery< HTMLElement >, key: string ) {
	return parseInt( String( element.data( key ) ), 10 );
}

function initMediaTextSlider() {
	const sliderContents = $(
		'.wp-block-getwid-media-text-slider:not(.getwid-init) .wp-block-getwid-media-text-slider__content'
	);
	const getwid = ( window as Window & { Getwid?: GetwidSliderGlobal } )
		.Getwid;

	sliderContents.each( function () {
		const sliderContent = $( this ) as SlickElement;
		const sliderRoot = sliderContent.closest(
			'.wp-block-getwid-media-text-slider'
		);
		const useAnimation = sliderRoot.data( 'animation' ) !== undefined;

		sliderRoot.addClass( 'getwid-init' );

		if ( useAnimation ) {
			sliderContent
				.find(
					'.wp-block-getwid-media-text-slider-slide .wp-block-getwid-media-text-slider-slide-content__content'
				)
				.css( 'opacity', '0' );
		}

		sliderContent.on( 'init', function () {
			if ( useAnimation ) {
				$( this )
					.find(
						'.wp-block-getwid-media-text-slider-slide.slick-active .wp-block-getwid-media-text-slider-slide-content__content'
					)
					.css( 'opacity', '1' );
			}
		} );

		let theSameSlide = false;

		sliderContent.on(
			'beforeChange',
			function ( _event, _slick, currentSlide, nextSlide ) {
				theSameSlide = currentSlide === nextSlide;
			}
		);

		sliderContent.on(
			'afterChange',
			function ( _event, _slick, currentSlide ) {
				if ( theSameSlide || ! useAnimation ) {
					return;
				}

				const nextSlideContent = $( this )
					.find(
						`.wp-block-getwid-media-text-slider-slide[data-slick-index="${ currentSlide }"]`
					)
					.find(
						'.wp-block-getwid-media-text-slider-slide-content__content'
					);

				sliderContent
					.find(
						'.wp-block-getwid-media-text-slider-slide .wp-block-getwid-media-text-slider-slide-content__content'
					)
					.css( 'opacity', '0' );

				if ( nextSlideContent.length ) {
					nextSlideContent.css( 'opacity', '1' );
					animateElement( nextSlideContent, {
						animation: String( sliderRoot.data( 'animation' ) ),
						duration: String( sliderRoot.data( 'duration' ) ),
						delay: String( sliderRoot.data( 'delay' ) ),
					} );
				}
			}
		);

		sliderContent.slick( {
			rows: 0,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: sliderContent.data( 'slide-autoplay' ) === true,
			pauseOnHover: sliderContent.data( 'slide-pause-on-hover' ) === true,
			autoplaySpeed: parseNumberData(
				sliderContent,
				'slide-autoplay-speed'
			),
			fade: sliderContent.data( 'slide-effect' ) === 'fade',
			speed: parseNumberData( sliderContent, 'slide-speed' ),
			infinite: sliderContent.data( 'infinite' ) === true,
			arrows: ! sliderRoot.hasClass( 'has-arrows-none' ),
			dots: ! sliderRoot.hasClass( 'has-dots-none' ),
			rtl: !! getwid?.isRTL,
		} );
	} );
}

$( () => {
	$( document.body ).on( 'post-load', initMediaTextSlider );
	initMediaTextSlider();
} );
