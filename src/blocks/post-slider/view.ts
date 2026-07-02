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
	getwid_fade_effect?: string;
	getwid_autoplay?: boolean;
	getwid_autoplay_speed?: number;
	getwid_infinite?: boolean;
	getwid_animation_speed?: number;
	getwid_arrows?: string;
	getwid_dots?: string;
	getwid_pause_on_hover?: boolean;
};

function parseNumber( value: string | number | undefined, fallback = 1 ) {
	const parsed = parseInt( String( value ), 10 );

	return Number.isNaN( parsed ) ? fallback : parsed;
}

function initPostSlider() {
	const sliders = jQuery(
		'.wp-block-getwid-post-slider:not(.getwid-init) .wp-block-getwid-post-slider__content'
	) as SliderElement;

	if ( ! sliders.length || typeof sliders.imagesLoaded === 'undefined' ) {
		return;
	}

	sliders.each( function () {
		const slider = jQuery( this ) as SliderElement;
		const options = ( slider.data( 'slider-option' ) ||
			{} ) as SliderOptionsData;

		slider
			.closest( '.wp-block-getwid-post-slider' )
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
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: !! options.getwid_autoplay,
				autoplaySpeed: parseNumber(
					options.getwid_autoplay_speed,
					2000
				),
				fade: options.getwid_fade_effect === 'fade',
				speed: parseNumber( options.getwid_animation_speed ),
				infinite: !! options.getwid_infinite,
				centerMode: false,
				variableWidth: false,
				pauseOnHover: !! options.getwid_pause_on_hover,
				adaptiveHeight: true,
				rtl: !! runtimeGlobal.Getwid?.isRTL,
			} );
		} );
	} );
}

jQuery( () => {
	jQuery( document.body ).on( 'post-load', initPostSlider );
	initPostSlider();
} );
