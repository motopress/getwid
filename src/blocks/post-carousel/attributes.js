const attributes = {
	postTemplate: {
		type: 'string',
	},

	//Custom Post Type
	postsToShow: {
		type: 'number',
		default: 5,
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
	parentPageId: {
		type: 'string',
	},
	postType: {
		type: 'string',
		default: 'post'
	},
	taxonomy: {
		type: 'array',
		items: {
			type: 'string',
		}
	},
	terms: {
		type: 'array',
		items: {
			type: 'string',
		}
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
	//Custom Post Type
	align: {
		type: 'string',
	},

	//Slider
	sliderSlidesToShowDesktop: {
		type: 'string',
		default: '2'
	},
	sliderSlidesToShowLaptop: {
		type: 'string',
		default: '1'
	},
	sliderSlidesToShowTablet: {
		type: 'string',
		default: '1'
	},
	sliderSlidesToShowMobile: {
		type: 'string',
		default: '1'
	},
	sliderSlidesToScroll: {
		type: 'string',
		default: '1'
	},
	sliderAutoplay: {
		type: 'boolean',
		default: false,
	},
	sliderAutoplaySpeed: {
		type: 'string',
		default: 6000
	},
	sliderInfinite: {
		type: 'boolean',
		default: true
	},
	sliderAnimationSpeed: {
		type: 'string',
		default: 800
	},
	sliderCenterMode: {
		type: 'boolean',
		default: false
	},
	sliderSpacing: {
		type: 'string',
		default: 'small',
	},
	sliderArrows: {
		type: 'string',
		default: 'inside'
	},
	sliderDots: {
		type: 'string',
		default: 'outside'
	},

	className: {
		type: 'string',
	},
};
export default attributes;
