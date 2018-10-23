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
		// default: 'wide'
	},
	contentMaxWidth: {
		type: 'number'
	},
	minHeight: {
		type: 'string',
	},
	verticalAlign: {
		type: 'string',
		// default: 'center'
	},
	horizontalAlign: {
		type: 'string',
		// default: 'center'
	},
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
		type: 'string',
		default: 100
	},
	// Background Image
	backgroundImage: {
		type: 'object',
	},
	backgroundImagePosition: {
		type: 'string',
		// default: 'center'
	},
	backgroundImageAttachment: {
		type: 'string',
		// default: 'cover'
	},
	backgroundImageRepeat: {
		type: 'string',
		// default: 'repeat'
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
		default: 100
	},
	sliderAnimationSpeed: {
		type: 'number',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-slider',
		attribute: 'data-autoplay-speed',
		default: 0,
	},
	// Background Video
	backgroundVideoUrl: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-video source',
		attribute: 'src',
	},
	backgroundVideoAutoplay: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-section__background-holder .wp-block-getwid-section__background-video',
		attribute: 'autoplay',
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
		type: 'number'
	},
	foregroundGradientSecondColor: {
		type: 'string'
	},
	foregroundGradientSecondColorLocation: {
		type: 'number'
	},
	foregroundGradientAngle: {
		type: 'number'
	},
	// Dividers
	dividerTop: {
		type: 'string'
	},
	dividerTopColor: {
		type: 'string'
	},
	dividerBottom: {
		type: 'string'
	},
	dividerBottomColor: {
		type: 'string'
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