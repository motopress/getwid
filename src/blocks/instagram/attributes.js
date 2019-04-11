const { __ } = wp.i18n;

const attributes = {
	photoCount: {
		type: 'number',
		default: 10,
	},
	displayStyle: {
		type: 'string',
		default: 'grid',
	},
	gridColumns: {
		type: 'number',
		default: 3,
	},	
	showLikes: {
		type: 'boolean',
		default: true,
	},
	showComments: {
		type: 'boolean',
		default: true,
	},
	align: {
		type: 'string',
	},

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