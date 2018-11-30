const { __ } = wp.i18n;

const attributes = {
	uniqueID: {
		type: 'string',
		default: '',
	},
	slideCount: {
		type: 'number',
		default: 3,
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

	titleColor: {
		type: 'string'
	},
	contentColor: {
		type: 'string'
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

	// Animation IN
	contentAnimation: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider',
		attribute: 'data-animation'
	},	
	contentAnimationDuration: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider',
		attribute: 'data-duration'
	},
	contentAnimationDelay: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider',
		attribute: 'data-delay'
	},

	//Slider settings
	sliderAnimationEffect: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider__content',
		attribute: 'data-slide-effect'
	},
	sliderAutoplay: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider__content',
		attribute: 'data-slide-autoplay',
		default: true
	},	
	sliderAutoplaySpeed: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider__content',
		attribute: 'data-slide-autoplay-speed',
		default: 3000
	},		
	sliderAnimationSpeed: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-media-text-slider__content',
		attribute: 'slide-speed',
		default: 1000,
	},

	currentSlide: {
		type: 'number',
		default: 1,
	},
	selectedSlide: {
		type: 'number',
		default: 1,
	},	
	slideAlignment: {
		type: 'string',
		default: 'left',
	},
	sliderArrays: {
		type: 'array',
		default: [
			{
				text: __( 'Slide 1', 'getwid' ),
			},
			{
				text: __( 'Slide 2', 'getwid' ),
			},
			{
				text: __( 'Slide 3', 'getwid' ),
			}
		],
	},
};
export default attributes;