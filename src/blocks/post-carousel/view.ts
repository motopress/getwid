import jQuery from 'jquery';

type ImagesLoadedInstance = {
	elements: HTMLElement[];
};

type ImagesLoadedChain = {
	done: ( callback: ( instance: ImagesLoadedInstance ) => void ) => void;
};

type SliderElement = JQuery< HTMLElement > & {
	imagesLoaded?: () => ImagesLoadedChain;
	slick?: ( options: Record< string, unknown > ) => SliderElement;
};

type SliderOptionsData = {
	sliderSlidesToShowDesktop?: string;
	getwid_slidesToShowLaptop?: string;
	getwid_slidesToShowTablet?: string;
	getwid_slidesToShowMobile?: string;
	getwid_slidesToScroll?: string;
	getwid_autoplay?: boolean;
	getwid_autoplay_speed?: number;
	getwid_infinite?: boolean;
	getwid_animation_speed?: number;
	getwid_center_mode?: boolean;
	getwid_pause_on_hover?: boolean;
	getwid_arrows?: string;
	getwid_dots?: string;
};

function parseNumber( value: string | number | undefined, fallback = 1 ) {
	const parsed = parseInt( String( value ), 10 );

	return Number.isNaN( parsed ) ? fallback : parsed;
}

function initPostCarousel() {
	const sliders = jQuery(
		'.wp-block-getwid-post-carousel:not(.getwid-init) .wp-block-getwid-post-carousel__wrapper'
	) as SliderElement;

	if ( ! sliders.length || typeof sliders.imagesLoaded === 'undefined' ) {
		return;
	}

	sliders.each( function () {
		const slider = jQuery( this ) as SliderElement;
		const options = ( slider.data( 'slider-option' ) ||
			{} ) as SliderOptionsData;

		slider
			.closest( '.wp-block-getwid-post-carousel' )
			.addClass( 'getwid-init' );

		slider.imagesLoaded?.().done( ( instance ) => {
			const currentSlider = jQuery(
				instance.elements[ 0 ]
			) as SliderElement;
			const runtimeGlobal = window as unknown as {
				Getwid?: {
					isRTL?: boolean;
				};
			};

			currentSlider.slick?.( {
				arrows: options.getwid_arrows !== 'none',
				dots: options.getwid_dots !== 'none',
				rows: 0,
				slidesToShow: parseNumber( options.sliderSlidesToShowDesktop ),
				slidesToScroll: parseNumber( options.getwid_slidesToScroll ),
				autoplay: !! options.getwid_autoplay,
				autoplaySpeed: parseNumber(
					options.getwid_autoplay_speed,
					2000
				),
				fade: false,
				speed: parseNumber( options.getwid_animation_speed ),
				infinite: !! options.getwid_infinite,
				centerMode: !! options.getwid_center_mode,
				variableWidth: false,
				pauseOnHover: !! options.getwid_pause_on_hover,
				adaptiveHeight: true,
				rtl: !! runtimeGlobal.Getwid?.isRTL,
				responsive: [
					{
						breakpoint: 991,
						settings: {
							slidesToShow: parseNumber(
								options.getwid_slidesToShowLaptop
							),
							slidesToScroll: 1,
						},
					},
					{
						breakpoint: 768,
						settings: {
							slidesToShow: parseNumber(
								options.getwid_slidesToShowTablet
							),
							slidesToScroll: 1,
						},
					},
					{
						breakpoint: 468,
						settings: {
							slidesToShow: parseNumber(
								options.getwid_slidesToShowMobile
							),
							slidesToScroll: 1,
						},
					},
				],
			} );
		} );
	} );
}

jQuery( () => {
	jQuery( document.body ).on( 'post-load', initPostCarousel );
	initPostCarousel();
} );
