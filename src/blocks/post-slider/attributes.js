const attributes = {
	backEnd: {
		type: 'boolean',
		default: true
	},	

	//Custom Post Type
	postsToShow: {
		type: 'number',
		default: 5,
	},
	postType: {
		type: 'string',
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
	className: {
		type: 'string',
	},
	contentLength: {
		type: 'number',
		default: 25,
	},
	align: {
		type: 'string',
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