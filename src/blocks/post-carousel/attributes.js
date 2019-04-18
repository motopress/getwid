const attributes = {
	titleTag: {
		type: 'string',
		default: 'h3',
	},
	imageSize: {
		type: 'string',
		default: 'large',
	},
	cropImages: {
		type: 'boolean',
		default: true,
	},
	categories: {
		type: 'string',
	},
	categories: {
		type: 'string',
	},
	className: {
		type: 'string',
	},
	postsToShow: {
		type: 'number',
		default: 5,
	},
	showTitle: {
		type: 'boolean',
		default: true,
	},
	showDate: {
		type: 'boolean',
		default: false,
	},
	showCategories: {
		type: 'boolean',
		default: false,
	},
	showCommentsCount: {
		type: 'boolean',
		default: false,
	},
	showContent: {
		type: 'boolean',
		default: false,
	},
	contentLength: {
		type: 'number',
		default: 55,
	},
	showFeaturedImage: {
		type: 'boolean',
		default: false,
	},
	postLayout: {
		type: 'string',
		default: 'list',
	},
	columns: {
		type: 'number',
		default: 3,
	},
	align: {
		type: 'string',
	},
	order: {
		type: 'string',
		default: 'desc',
	},
	orderBy: {
		type: 'string',
		default: 'date',
	},

	//Slider
	sliderAnimationEffect: {
		type: 'string',
		default: 'slide'
	},
	sliderSlidesToShow: {
		type: 'string',
		default: '1'
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
	sliderVariableWidth: {
		type: 'boolean',
		default: false
	},
	sliderSpacing: {
		type: 'string',
		default: 'none',
	},
	sliderArrows: {
		type: 'string',
		default: 'inside'
	},
	sliderDots: {
		type: 'string',
		default: 'inside'
	},	
};
export default attributes;