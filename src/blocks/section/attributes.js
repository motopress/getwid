const attributes = {
	// Alignment
	align: {
		type: 'string'
	},
	skipLayout: {
		type: 'boolean',
		default: false
	},
	contentMaxWidthPreset: {
		type: 'string'
	},
	contentMaxWidth: {
		type: 'number'
	},
	minHeight: {
		type: 'string',
	},
	gapSize: {
		type: 'string',
	},
	resetMinHeightTablet: {
		type: 'boolean',
		default: false
	},
	resetMinHeightMobile: {
		type: 'boolean',
		default: false
	},

	verticalAlign: {
		type: 'string',
		default: 'center'
	},
	verticalAlignTablet: {
		type: 'string',
		default: ''
	},
	verticalAlignMobile: {
		type: 'string',
		default: ''
	},

	horizontalAlign: {
		type: 'string',
		default: 'center'
	},
	horizontalAlignTablet: {
		type: 'string',
		default: ''
	},
	horizontalAlignMobile: {
		type: 'string',
		default: ''
	},

	// Background
	backgroundColor: {
		type: 'string',
	},
	customBackgroundColor: {
		type: 'string',
	},

	//Gradient
	backgroundGradientFirstColor: {
		type: 'string',
	},
	backgroundGradientFirstColorLocation: {
		type: 'number',
		default: 0
	},
	backgroundGradientSecondColor: {
		type: 'string',
	},
	backgroundGradientSecondColorLocation: {
		type: 'number',
		default: 100
	},
	backgroundGradientType: {
		type: 'string',
	},
	backgroundGradientAngle: {
		type: 'number',
		default: 180
	},

	// Background Image
	backgroundImage: {
		type: 'object',
	},
	backgroundCustomImagePosition: {
		type: 'object',
	},
	backgroundImagePosition: {
		type: 'string',
	},
	backgroundImageAttachment: {
		type: 'string',
	},
	backgroundImageRepeat: {
		type: 'string',
	},
	backgroundImageSize: {
		type: 'string'
	},

	// Background Slider
	sliderImages: {
		type: 'array',
		default: [],
		source: 'query',
		selector: '.wp-block-getwid-section__background-slider>.wp-block-getwid-section__background-slider-item',
		query: {
			url: {
				source: 'attribute',
				selector: 'img',
				attribute: 'src',
			},
			alt: {
				source: 'attribute',
				selector: 'img',
				attribute: 'alt',
				default: '',
			},
			id: {
				source: 'attribute',
				selector: 'img',
				attribute: 'data-id',
			},
		},
	},
	sliderAnimationEffect: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-slider',
		attribute: 'data-slide-effect'
	},
	sliderAnimationDuration:{
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-slider',
		attribute: 'data-slide-speed',
		default: 1000
	},
	sliderAnimationSpeed: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-slider',
		attribute: 'data-autoplay-speed',
		default: 5000,
	},
	// Background Video
	backgroundVideoType: {
		type: 'string',
		default: 'self'
	},
	youTubeVideoUrl: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-video-youtube',
		attribute: 'youtube-video-url',
	},
	youTubeVideoMute: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-video-youtube',
		attribute: 'youtube-video-muted',
		default: 'false'
	},
	youTubeVideoLoop: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-video-youtube',
		attribute: 'youtube-video-loop',
		default: 'false'
	},
	youTubeVideoAutoplay: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-video-youtube',
		attribute: 'youtube-video-autoplay',
		default: 'false'
	},
	backgroundVideoUrl: {
		type: 'object',
	},
	backgroundVideoMute: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-video',
		attribute: 'muted',
		default: false
	},
	backgroundVideoLoop: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-video',
		attribute: 'loop',
		default: false
	},
	backgroundVideoAutoplay: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-video',
		attribute: 'autoplay',
		default: false
	},
	backgroundVideoPoster: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-video',
		attribute: 'poster',
	},
	backgroundVideoControlsPosition: {
		type: 'string',
		default: 'top-right'
	},

	// Foreground
	foregroundOpacity: {
		type: 'number'
	},
	foregroundColor: {
		type: 'string'
	},
	foregroundImage: {
		type: 'object'
	},
	foregroundCustomImagePosition: {
		type: 'object',
	},
	foregroundImagePosition: {
		type: 'string'
	},
	foregroundImageAttachment: {
		type: 'string'
	},
	foregroundImageRepeat: {
		type: 'string'
	},
	foregroundImageSize: {
		type: 'string'
	},
	foregroundFilter: {
		type: 'string'
	},
	foregroundGradientType: {
		type: 'string'
	},
	foregroundGradientFirstColor: {
		type: 'string'
	},
	foregroundGradientFirstColorLocation: {
		type: 'number',
		default: 0
	},
	foregroundGradientSecondColor: {
		type: 'string'
	},
	foregroundGradientSecondColorLocation: {
		type: 'number',
		default: 100
	},
	foregroundGradientAngle: {
		type: 'number',
		default: 180
	},
	// Dividers
	dividerTop: {
		type: 'string'
	},
	dividersTopHeight: {
		type: 'string'
	},
	dividerTopColor: {
		type: 'string',
		default: 'white'
	},
	dividerBottom: {
		type: 'string'
	},
	dividersBottomHeight: {
		type: 'string'
	},
	dividersBringTop: {
		type: 'boolean',
		default: false,
	},
	dividerBottomColor: {
		type: 'string',
		default: 'white'
	},
	// Animation
	entranceAnimation: {
		type: 'string'
	},
	entranceAnimationDuration: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section',
		attribute: 'data-wow-duration',
		default: '1500ms'
	},
	entranceAnimationDelay: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section',
		attribute: 'data-wow-delay',
		default: '200ms'
	},

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

	// Margin
	marginTopValue: {
		type: 'string'
	},
	marginBottomValue: {
		type: 'string'
	},
	marginLeftValue: {
		type: 'string'
	},
	marginRightValue: {
		type: 'string'
	},

	marginTop:{
		type: 'string',
		default: ''
	},
	marginBottom:{
		type: 'string',
		default: ''
	},
	marginLeft:{
		type: 'string',
		default: ''
	},
	marginRight:{
		type: 'string',
		default: ''
	},

	marginTopTablet:{
		type: 'string',
		default: ''
	},
	marginBottomTablet:{
		type: 'string',
		default: ''
	},
	marginLeftTablet:{
		type: 'string',
		default: ''
	},
	marginRightTablet:{
		type: 'string',
		default: ''
	},

	marginTopMobile:{
		type: 'string',
		default: ''
	},
	marginBottomMobile:{
		type: 'string',
		default: ''
	},
	marginLeftMobile:{
		type: 'string',
		default: ''
	},
	marginRightMobile:{
		type: 'string',
		default: ''
	}
};

export default attributes;
