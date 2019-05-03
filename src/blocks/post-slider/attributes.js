const attributes = {
	//Content settings
	minHeight: {
		type: 'string',
	},
	contentMaxWidth: {
		type: 'number'
	},
	verticalAlign: {
		type: 'string',
	},
	horizontalAlign: {
		type: 'string',
	},
	textColor: {
		type: 'string'
	},
	overlayColor: {
		type: 'string',
	},
	overlayOpacity: {
		type: 'number',
		default: '30'
	},

	//Posts settings
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
		default: true,
	},
	contentLength: {
		type: 'number',
		default: 25,
	},
	showFeaturedImage: {
		type: 'boolean',
		default: true,
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

	//Slider settings
	sliderAnimationEffect: {
		type: 'string',
		default: 'slide'
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