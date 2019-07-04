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
		default: 'post',
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

	// Padding
	paddingTopValue: {
		type: 'string'
	},
	paddingBottomValue: {
		type: 'string'
	},
	paddingLeftValue: {
		type: 'string'
	},
	paddingRightValue: {
		type: 'string'
	},

	paddingTop:{
		type: 'string',
		default: ''
	},
	paddingBottom:{
		type: 'string',
		default: ''
	},
	paddingLeft:{
		type: 'string',
		default: ''
	},
	paddingRight:{
		type: 'string',
		default: ''
	},

	paddingTopTablet:{
		type: 'string',
		default: ''
	},
	paddingBottomTablet:{
		type: 'string',
		default: ''
	},
	paddingLeftTablet:{
		type: 'string',
		default: ''
	},
	paddingRightTablet:{
		type: 'string',
		default: ''
	},


	paddingTopMobile:{
		type: 'string',
		default: ''
	},
	paddingBottomMobile:{
		type: 'string',
		default: ''
	},
	paddingLeftMobile:{
		type: 'string',
		default: ''
	},
	paddingRightMobile:{
		type: 'string',
		default: ''
	},

	//Posts settings
	align: {
		type: 'string',
	},
	textAlignment: {
		type: 'string',
		default: 'left',
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

	className: {
		type: 'string',
	},	
	anchor: {
		type: 'string',
	},		
};
export default attributes;