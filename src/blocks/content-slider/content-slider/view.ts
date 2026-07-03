import $ from 'jquery';

type GetwidSliderGlobal = {
	isRTL: boolean;
};

type SlickOptions = Record< string, unknown >;

type SlickElement = JQuery< HTMLElement > & {
	slick: ( options: SlickOptions ) => void;
};

const getwid = ( window as Window & { Getwid?: GetwidSliderGlobal } ).Getwid;

function initSliders() {
	const sliders = $( '.wp-block-getwid-content-slider:not(.getwid-init)' );

	if ( ! sliders.length ) {
		return;
	}

	sliders.each( function () {
		const sliderRoot = $( this );
		const slider = sliderRoot
			.find( '.wp-block-getwid-content-slider__wrapper' )
			.first() as SlickElement;

		sliderRoot.addClass( 'getwid-init' );

		slider.slick( {
			autoplay: !! sliderRoot.data( 'autoplay' ),
			autoplaySpeed: sliderRoot.data( 'autoplay-speed' ) ?? 3000,
			arrows: sliderRoot.data( 'arrows' ) !== 'none',
			dots: sliderRoot.data( 'dots' ) !== 'none',
			speed: sliderRoot.data( 'animation-speed' ) ?? 800,
			infinite: !! sliderRoot.data( 'infinite' ),
			fade: sliderRoot.data( 'effect' ) === 'fade',
			centerMode: !! sliderRoot.data( 'center-mode' ),
			adaptiveHeight: !! sliderRoot.data( 'adaptive-height' ),
			draggable: sliderRoot.data( 'draggable' ) ?? true,
			pauseOnHover: !! sliderRoot.data( 'pause-hover' ),
			rows: 0,
			slidesToShow: sliderRoot.data( 'slides-show' ) ?? 1,
			slidesToScroll: sliderRoot.data( 'slides-scroll' ) ?? 1,
			rtl: !! getwid?.isRTL,
			responsive: [
				{
					breakpoint: 991,
					settings: {
						slidesToShow:
							sliderRoot.data( 'slides-show-laptop' ) ?? 1,
						slidesToScroll:
							sliderRoot.data( 'slides-scroll-laptop' ) ?? 1,
					},
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow:
							sliderRoot.data( 'slides-show-tablet' ) ?? 1,
						slidesToScroll:
							sliderRoot.data( 'slides-scroll-tablet' ) ?? 1,
					},
				},
				{
					breakpoint: 468,
					settings: {
						slidesToShow:
							sliderRoot.data( 'slides-show-mobile' ) ?? 1,
						slidesToScroll:
							sliderRoot.data( 'slides-scroll-mobile' ) ?? 1,
					},
				},
			],
		} );
	} );
}

$( () => {
	$( document.body ).on( 'post-load', initSliders );
	initSliders();
} );
