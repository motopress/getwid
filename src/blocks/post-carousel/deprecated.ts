import type { PostCarouselAttributes } from './types';

const attributes = {
	postTemplate: {
		type: 'string',
	},
	postsToShow: {
		type: 'number',
		default: 5,
	},
	offset: {
		type: 'number',
		default: 0,
	},
	ignoreSticky: {
		type: 'boolean',
		default: true,
	},
	filterById: {
		type: 'string',
	},
	excludeById: {
		type: 'string',
	},
	excludeCurrentPost: {
		type: 'boolean',
		default: false,
	},
	childPagesCurrentPage: {
		type: 'boolean',
		default: false,
	},
	parentPageId: {
		type: 'string',
	},
	postType: {
		type: 'string',
		default: 'post',
	},
	taxonomy: {
		type: 'array',
		items: {
			type: 'string',
		},
	},
	terms: {
		type: 'array',
		items: {
			type: 'string',
		},
	},
	relation: {
		type: 'string',
		default: 'AND',
	},
	order: {
		type: 'string',
		default: 'desc',
	},
	orderBy: {
		type: 'string',
		default: 'date',
	},
	align: {
		type: 'string',
	},
	sliderSlidesToShowDesktop: {
		type: 'string',
		default: '2',
	},
	sliderSlidesToShowLaptop: {
		type: 'string',
		default: '1',
	},
	sliderSlidesToShowTablet: {
		type: 'string',
		default: '1',
	},
	sliderSlidesToShowMobile: {
		type: 'string',
		default: '1',
	},
	sliderSlidesToScroll: {
		type: 'string',
		default: '1',
	},
	sliderAutoplay: {
		type: 'boolean',
		default: false,
	},
	sliderPauseOnHover: {
		type: 'boolean',
		default: false,
	},
	sliderAutoplaySpeed: {
		type: 'string',
		default: 6000,
	},
	sliderInfinite: {
		type: 'boolean',
		default: true,
	},
	sliderAnimationSpeed: {
		type: 'string',
		default: 800,
	},
	sliderCenterMode: {
		type: 'boolean',
		default: false,
	},
	sliderSpacing: {
		type: 'string',
		default: 'small',
	},
	sliderArrows: {
		type: 'string',
		default: 'inside',
	},
	sliderDots: {
		type: 'string',
		default: 'outside',
	},
	className: {
		type: 'string',
	},
	metaQuery: {
		type: 'array',
		default: [],
	},
};

const deprecated = [
	{
		attributes,
		isEligible() {
			return true;
		},
		migrate( blockAttributes: PostCarouselAttributes ) {
			const { sliderArrows, sliderDots } = blockAttributes;

			return {
				...blockAttributes,
				sliderArrows:
					sliderArrows === 'ouside' ? 'outside' : sliderArrows,
				sliderDots: sliderDots === 'ouside' ? 'outside' : sliderDots,
			};
		},
		save: () => null,
	},
];

export default deprecated;
