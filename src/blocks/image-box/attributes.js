const attributes = {
	
	image: {
		type: 'object',
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
	textAlignment: {
		type: 'string',
		default: 'center',
	},
	layout: {
		type: 'string',
	},		
	iconPosition: {
		type: 'string',
		default: 'top',
	},	
	iconStyle: {
		type: 'string',
		default: 'default',
	},
	primaryColor: {
		type: 'string',
	},
	secondaryColor: {
		type: 'string',
	},
	iconSize: {
		type: 'string',
		default: '32px'
	},
	padding: {
		type: 'number',
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

	borderWidth: {
		type: 'number',
	},
	borderRadius: {
		type: 'number',
		default: 50,
	},
	link: {
		type: 'string',
		source: 'attribute',
		selector: 'a.wp-block-getwid-icon-box__icon-wrapper',
		attribute: 'href'
	},
	newWindow: {
		type: 'boolean',
		default: false,
	},	
	align: {
		type: 'string'
	},
	hoverAnimation: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-icon-box',
		attribute: 'data-animation'
	},
};

export default attributes;
