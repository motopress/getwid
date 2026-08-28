import jQuery from 'jquery';

import { baseClass } from './utils';

type ImagesLoadedInstance = {
	elements: HTMLElement[];
};

type ImagesLoadedChain = {
	done: ( callback: ( instance: ImagesLoadedInstance ) => void ) => void;
};

type SliderElement = JQuery< HTMLElement > & {
	imagesLoaded?: () => ImagesLoadedChain;
	slick?: ( options: SliderOptions ) => SliderElement;
};

type SliderOptions = {
	arrows: boolean;
	dots: boolean;
	rows: number;
	slidesToShow: number;
	slidesToScroll: number;
	autoplay: boolean;
	autoplaySpeed: number;
	fade: boolean;
	speed: number;
	infinite: boolean;
	centerMode: boolean;
	variableWidth: boolean;
	pauseOnHover: boolean;
	adaptiveHeight: boolean;
	rtl: boolean;
	responsive: Array< {
		breakpoint: number;
		settings: {
			slidesToShow: number;
			slidesToScroll: number;
		};
	} >;
};

function getBooleanData( slider: SliderElement, name: string ) {
	return slider.data( name ) === true;
}

function getNumberData( slider: SliderElement, name: string, fallback = 1 ) {
	const value = parseInt( String( slider.data( name ) ), 10 );

	return value || fallback;
}

function initSliders() {
	const sliders = jQuery(
		`.${ baseClass }:not(.getwid-init) .${ baseClass }__wrapper`
	) as SliderElement;

	if ( ! sliders.length || typeof sliders.imagesLoaded === 'undefined' ) {
		return;
	}

	sliders.each( function () {
		const slider = jQuery( this ) as SliderElement;

		slider.closest( `.${ baseClass }` ).addClass( 'getwid-init' );

		slider.imagesLoaded?.().done( ( instance ) => {
			const currentSlider = jQuery(
				instance.elements[ 0 ]
			) as SliderElement;
			const fadeEffect = currentSlider.data( 'effect' ) === 'fade';
			const slidesToShow =
				currentSlider.data( 'slides-show' ) &&
				currentSlider.data( 'effect' ) === 'slide'
					? getNumberData( currentSlider, 'slides-show' )
					: 1;
			const runtimeGlobal = window as unknown as {
				Getwid?: {
					isRTL?: boolean;
				};
			};

			currentSlider.slick?.( {
				arrows: currentSlider.data( 'arrows' ) !== 'none',
				dots: currentSlider.data( 'dots' ) !== 'none',
				rows: 0,
				slidesToShow,
				slidesToScroll: getNumberData( currentSlider, 'slides-scroll' ),
				autoplay: getBooleanData( currentSlider, 'autoplay' ),
				autoplaySpeed: getNumberData(
					currentSlider,
					'autoplay-speed',
					2000
				),
				fade: fadeEffect,
				speed: getNumberData( currentSlider, 'animation-speed' ),
				infinite: getBooleanData( currentSlider, 'infinite' ),
				centerMode: getBooleanData( currentSlider, 'center-mode' ),
				variableWidth: getBooleanData(
					currentSlider,
					'variable-width'
				),
				pauseOnHover: getBooleanData( currentSlider, 'pause-hover' ),
				adaptiveHeight: true,
				rtl: !! runtimeGlobal.Getwid?.isRTL,
				responsive: [
					{
						breakpoint: 991,
						settings: {
							slidesToShow: getNumberData(
								currentSlider,
								'slides-show-laptop'
							),
							slidesToScroll: 1,
						},
					},
					{
						breakpoint: 768,
						settings: {
							slidesToShow: getNumberData(
								currentSlider,
								'slides-show-tablet'
							),
							slidesToScroll: 1,
						},
					},
					{
						breakpoint: 468,
						settings: {
							slidesToShow: getNumberData(
								currentSlider,
								'slides-show-mobile'
							),
							slidesToScroll: 1,
						},
					},
				],
			} );
		} );
	} );
}

jQuery( document ).ready( () => {
	jQuery( document.body ).on( 'post-load', initSliders );

	initSliders();
} );
