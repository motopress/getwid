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
		type: 'string',
		default: 'excerpt',
	},	
	contentLength: {
		type: 'number',
		default: 55,
	},
	showFeaturedImage: {
		type: 'boolean',
		default: true,
	},
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
		default: 'ouside'
	},	

	className: {
		type: 'string',
	},	
	anchor: {
		type: 'string',
	},		
};
export default attributes;