const { __ } = wp.i18n;

const sliderOptions = {
	icon: '',
	iconSide: 'right',
	onlyIcon: false,	
	background:{
		color: '',
		gradient: {
			gradientType: '',
			firstColor: '',
			firstColorLocation: 0,
			secondColor: '',
			secondColorLocation: 100,
			gradientAngle: 180
		},
		image: {
			imageObj: {},
			imagePosition: '',
			imageAttachment: '',
			imageRepeat: '',
			imageSize: ''
		},
	},

	foreground:{
		opacity: 0,
		color: '',
		gradient: {
			gradientType: '',
			firstColor: '',
			firstColorLocation: 0,
			secondColor: '',
			secondColorLocation: 100,
			gradientAngle: 180
		},
		image: {
			imageObj: {},
			imagePosition: '',
			imageAttachment: '',
			imageRepeat: '',
			imageSize: ''
		},
	},	
};

const attributes = {
	uniqueID: {
		type: 'string',
		default: '',
	},
	slideCount: {
		type: 'number',
		default: 3,
	},






	// Background
/*	backgroundColor: {
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
	},*/

	// Background Image
/*	backgroundImage: {
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
*/














	currentSlide: {
		type: 'number',
		default: 1,
	},
	slideAlignment: {
		type: 'string',
		default: 'left',
	},
	blockAlignment: {
		type: 'string',
		default: 'none',
	},
	sliderArrays: {
		type: 'array',
		default: [
		{
			text: __( 'Slide 1', 'getwid' ),
			...sliderOptions
		},
		{
			text: __( 'Slide 2', 'getwid' ),
			...sliderOptions
		},
		{
			text: __( 'Slide 3', 'getwid' ),
			...sliderOptions
		}
		],
	},
	iSize: {
		type: 'number',
		default: 14,
	},
};
export default attributes;