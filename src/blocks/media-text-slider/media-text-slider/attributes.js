const attributes = {
	slideCount: {
		type: 'number',
		default: 3,
	},
	imageSize: {
		type: 'string',
		default: 'full',
	},
	// Alignment
	align: {
		type: 'string',
	},

	//Content settings
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

	textColor: {
		type: 'string'
	},

	// Background
	overlayColor: {
		type: 'string',
	},
	overlayOpacity: {
		type: 'number',
		default: '30'
	},

	// Animation IN
	contentAnimation: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider',
		attribute: 'data-animation',
		default: 'fadeIn'
	},	
	contentAnimationDuration: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider',
		attribute: 'data-duration',
		default: '1500ms'
	},
	contentAnimationDelay: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider',
		attribute: 'data-delay',
		default: '0ms'
	},

	//Slider settings
	sliderAnimationEffect: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider__content',
		attribute: 'data-slide-effect',
	},
	sliderAutoplay: {
		type: 'boolean',
		default: false,
	},
	pauseOnHover: {
		type: 'boolean',
		default: true,
	},
	sliderAutoplaySpeed: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider__content',
		attribute: 'data-slide-autoplay-speed',
		default: 5000
	},		
	sliderAnimationSpeed: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider__content',
		attribute: 'slide-speed',
		default: 1000,
	},
	sliderArrays: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider',
		attribute: 'data-labels',
		default: '["Slide 1","Slide 2","Slide 3"]'
	},
	sliderArrows: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider__content',
		attribute: 'data-arrows',
		default: 'inside'
	},
	sliderDots: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider__content',
		attribute: 'data-dots',
		default: 'inside'
	}
};

export default attributes;