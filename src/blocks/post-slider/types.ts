import type { BlockEditProps } from '@wordpress/blocks';
import type { MetaQueryGroup, QueryValues } from 'getwid-components';

export type PostSliderAttributes = QueryValues & {
	postTemplate?: string;
	minHeight?: string;
	align?: string;
	textAlignment: string;
	sliderAnimationEffect: string;
	sliderAutoplay: boolean;
	sliderPauseOnHover: boolean;
	sliderAutoplaySpeed: string | number;
	sliderInfinite: boolean;
	sliderAnimationSpeed: string | number;
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
};

export type PostSliderEditProps = BlockEditProps< PostSliderAttributes > & {
	recentPosts?: unknown[];
};

export type ServerSideRenderProps = {
	block: string;
	attributes: PostSliderAttributes;
};
