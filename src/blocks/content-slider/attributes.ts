import type { SliderDataAttribute } from './types';

export const sliderDataAttributes: Record< string, SliderDataAttribute > = {
	autoplay: {
		attribute: 'data-autoplay',
		default: false,
	},
	autoplaySpeed: {
		attribute: 'data-autoplay-speed',
		default: 3000,
	},
	animationSpeed: {
		attribute: 'data-animation-speed',
		default: 800,
	},
	infinite: {
		attribute: 'data-infinite',
		default: false,
	},
	animationEffect: {
		attribute: 'data-effect',
		default: 'slide',
	},
	centerMode: {
		attribute: 'data-center-mode',
		default: false,
	},
	adaptiveHeight: {
		attribute: 'data-adaptive-height',
		default: false,
	},
	draggable: {
		attribute: 'data-draggable',
		default: true,
	},
	pauseOnHover: {
		attribute: 'data-pause-hover',
		default: false,
	},
	arrows: {
		attribute: 'data-arrows',
		default: 'inside',
	},
	dots: {
		attribute: 'data-dots',
		default: 'inside',
	},
	slidesToShow: {
		attribute: 'data-slides-show',
		default: '1',
	},
	slidesToShowLaptop: {
		attribute: 'data-slides-show-laptop',
		default: '1',
	},
	slidesToShowTablet: {
		attribute: 'data-slides-show-tablet',
		default: '1',
	},
	slidesToShowMobile: {
		attribute: 'data-slides-show-mobile',
		default: '1',
	},
	slidesToScroll: {
		attribute: 'data-slides-scroll',
		default: '1',
	},
	slidesToScrollLaptop: {
		attribute: 'data-slides-scroll-laptop',
		default: '1',
	},
	slidesToScrollTablet: {
		attribute: 'data-slides-scroll-tablet',
		default: '1',
	},
	slidesToScrollMobile: {
		attribute: 'data-slides-scroll-mobile',
		default: '1',
	},
};

export const sliderAttributeNames = Object.keys(
	sliderDataAttributes
) as Array< keyof typeof sliderDataAttributes >;
