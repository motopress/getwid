const { __ } = wp.i18n;

const attributes = {

	content: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-advanced-heading__content',
		default: '',
	},

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

	titleTag: {
		type: 'string',
		default: 'div'
	},
	fontFamily: {
		type: 'string',
		default: ''
	},
	fontSize: {
		type: 'string',
	},
	fontWeight: {
		type: 'string',
	},
	fontStyle: {
		type: 'string',
	},	
	textTransform: {
		type: 'string',
	},
	lineHeight: {
		type: 'string',
	},
	letterSpacing: {
		type: 'string',
	},

	// Alignment
	align: {
		type: 'string',
	},
	textAlignment: {
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

	// Animation IN
	textAnimation: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-advanced-heading',
		attribute: 'data-animation',
		default: ''
	},	
	textAnimationDuration: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-advanced-heading',
		attribute: 'data-duration',
		default: '1500ms'
	},
	textAnimationDelay: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-advanced-heading',
		attribute: 'data-delay',
		default: '0ms'
	},
};
export default attributes;