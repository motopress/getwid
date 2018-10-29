const attributes = {
	// Padding
	paddingTop: {
		type: 'string'
	},
	paddingBottom: {
		type: 'string'
	},
	paddingLeft: {
		type: 'string'
	},
	paddingRight: {
		type: 'string'
	},

	// Margins
	marginTop: {
		type: 'string'
	},
	marginBottom: {
		type: 'string'
	},
	marginLeft: {
		type: 'string'
	},
	marginRight: {
		type: 'string'
	},

	// Alignment
	align: {
		type: 'string',
	},
	contentMaxWidth: {
		type: 'number'
	},
	minHeight: {
		type: 'string',
	},
	verticalAlign: {
		type: 'string',
	},
	horizontalAlign: {
		type: 'string',
	},

	// Background
	backgroundColor: {
		type: 'string',
	},
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
		type: 'number',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-slider',
		attribute: 'data-slide-speed',
		default: 1000
	},
	sliderAnimationSpeed: {
		type: 'number',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-slider',
		attribute: 'data-autoplay-speed',
		default: 5000,
	},
	// Background Video
	backgroundVideoUrl: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-video source',
		attribute: 'src',
	},
	backgroundVideoMute: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-video',
		attribute: 'muted',
	},
	backgroundVideoLoop: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-video',
		attribute: 'loop',
	},
	backgroundVideoPoster: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-video',
		attribute: 'poster',
	},
	// Foreground
	foregroundOpacity: {
		type: 'number'
	},
	foregroundColor: {
		type: 'string'
	},
	foregroundImage: {
		type: 'string'
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
	dividerTopColor: {
		type: 'string',
		default: 'white'
	},
	dividerBottom: {
		type: 'string'
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
		attribute: 'data-wow-duration'
	},
	entranceAnimationDelay: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section',
		attribute: 'data-wow-delay'
	},
};

export default attributes;