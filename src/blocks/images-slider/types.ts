import type { BlockEditProps } from '@wordpress/blocks';

export type SliderImage = {
	id?: number | string;
	align?: string;
	url?: string;
	source_url?: string;
	original_url?: string;
	link?: string;
	custom_link?: string;
	custom_link_target?: string;
	custom_link_rel?: string;
	alt?: string;
	alt_text?: string;
	caption?: string | { raw?: string };
	media_details?: {
		sizes?: Record< string, { source_url?: string } >;
	};
	sizes?: Record< string, { url?: string } >;
};

export type ImagesSliderAttributes = {
	align?: string;
	images: SliderImage[];
	ids: Array< number | string | undefined >;
	imageSize: string;
	imageFit: string;
	showCaption: boolean;
	captionStyle: string;
	captionPosition: string;
	linkTo: string;
	imageAlignment: string;
	sliderAnimationEffect: string;
	sliderSlidesToShow: string;
	sliderSlidesToShowLaptop: string;
	sliderSlidesToShowTablet: string;
	sliderSlidesToShowMobile: string;
	sliderSlidesToScroll: string;
	sliderAutoplay: boolean;
	sliderAutoplaySpeed: string;
	sliderPauseOnHover: boolean;
	sliderInfinite: boolean;
	sliderAnimationSpeed: string;
	sliderCenterMode: boolean;
	sliderVariableWidth: boolean;
	sliderSpacing: string;
	sliderArrows: string;
	sliderDots: string;
	slideHeight?: string;
	resetHeightOnTablet?: boolean;
	resetHeightOnMobile?: boolean;
	imageCrop?: boolean;
};

export type ImagesSliderEditProps = BlockEditProps< ImagesSliderAttributes > & {
	className?: string;
};

export type CoreSelect = {
	getMediaItems: ( query: {
		include: string;
		per_page: number;
	} ) => SliderImage[] | null;
};
