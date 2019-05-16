const attributes = {
	backEnd: {
		type: 'boolean',
		default: true
	},	

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

	//Colors
	backgroundColor: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	customBackgroundColor: {
		type: 'string',
	},
	customTextColor: {
		type: 'string',
	},

	overlayOpacity: {
		type: 'number',
		default: '30'
	},	
	//Colors

	//Posts settings
	titleTag: {
		type: 'string',
		default: 'h3',
	},
	imageSize: {
		type: 'string',
		default: 'large',
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
	contentLength: {
		type: 'number',
		default: 25,
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