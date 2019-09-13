let default_date = new Date(Getwid.settings.date_time_utc);
default_date.setDate(default_date.getDate() + 1);

const attributes = {
	dateTime: {
		type: 'string',
		default: default_date,
	},
	years: {
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
	
	innerPadding: {
		type: 'string',
		default: 'default'
	},
	
	innerSpacings: {
		type: 'string',
		default: 'none'
	},

};
export default attributes;