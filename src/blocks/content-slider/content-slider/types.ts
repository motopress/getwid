import type { BlockEditProps } from '@wordpress/blocks';

export type ContentSliderAttributes = {
	align?: string;
	autoplay: boolean;
	autoplaySpeed: string | number;
	animationSpeed: string | number;
	infinite: boolean;
	animationEffect: string;
	centerMode: boolean;
	adaptiveHeight: boolean;
	draggable: string | boolean;
	pauseOnHover: boolean;
	arrows: string;
	dots: string;
	slidesToShow: string;
	slidesToShowLaptop: string;
	slidesToShowTablet: string;
	slidesToShowMobile: string;
	slidesToScroll: string;
	slidesToScrollLaptop: string;
	slidesToScrollTablet: string;
	slidesToScrollMobile: string;
};

export type ContentSliderEditProps = BlockEditProps< ContentSliderAttributes >;

export type ContentSliderSlideAttributes = Record< string, never >;

export type SliderDataAttribute = {
	attribute: string;
	default: unknown;
};
