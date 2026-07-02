import type { BlockEditProps } from '@wordpress/blocks';
import type { MetaQueryGroup, QueryValues } from 'getwid-components';

export type PostCarouselAttributes = QueryValues & {
	postTemplate?: string;
	align?: string;
	sliderSlidesToShowDesktop: string;
	sliderSlidesToShowLaptop: string;
	sliderSlidesToShowTablet: string;
	sliderSlidesToShowMobile: string;
	sliderSlidesToScroll: string;
	sliderAutoplay: boolean;
	sliderPauseOnHover: boolean;
	sliderAutoplaySpeed: string | number;
	sliderInfinite: boolean;
	sliderAnimationSpeed: string | number;
	sliderCenterMode: boolean;
	sliderSpacing: string;
	sliderArrows: string;
	sliderDots: string;
	className?: string;
	metaQuery: MetaQueryGroup[];
	titleTag?: string;
	imageSize?: string;
	cropImages?: boolean;
	showTitle?: boolean;
	showDate?: boolean;
	showCategories?: boolean;
	showCommentsCount?: boolean;
	showContent?: string;
	contentLength?: number;
	showFeaturedImage?: boolean;
};

export type PostCarouselEditProps = BlockEditProps< PostCarouselAttributes > & {
	recentPosts?: unknown[];
};

export type ServerSideRenderProps = {
	block: string;
	attributes: PostCarouselAttributes;
};
