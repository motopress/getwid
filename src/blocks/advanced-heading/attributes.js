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
		default: 'span'
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