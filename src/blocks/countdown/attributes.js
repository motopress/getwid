const attributes = {
	dateTime: {
		type: 'string',
	},
	year: {
		type: 'boolean',
		default: false,
	},
	months: {
		type: 'boolean',
		default: false,
	},
	weeks: {
		type: 'boolean',
		default: false,
	},	
	days: {
		type: 'boolean',
		default: true,
	},
	hours: {
		type: 'boolean',
		default: true,
	},
	minutes: {
		type: 'boolean',
		default: true,
	},
	seconds: {
		type: 'boolean',
		default: true,
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
	
	// Fonts
	fontFamily: {
		type: 'string',
		default: ''
	},
	fontSize: {
		type: 'string',
	},
	fontSizeTablet: {
		type: 'string',
		default: 'fs-tablet-100'
	},
	fontSizeMobile: {
		type: 'string',
		default: 'fs-mobile-100'
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
	}

};
export default attributes;