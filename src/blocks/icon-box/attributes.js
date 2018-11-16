const attributes = {
	// id: {
	// 	type: 'string'
	// },
	textAlignment: {
		type: 'string',
	},
	icon: {
		type: 'string',
		default: 'fab fa-angellist'
	},
	layout: {
		type: 'string',
		default: 'center',
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
		type: 'number',
	},
	padding: {
		type: 'number',
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
		selector: 'a.wp-block-getwid-icon__wrapper',
		attribute: 'href'
	},
	align: {
		type: 'string'
	},
	hoverAnimation: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-icon__wrapper',
		attribute: 'data-animation'
	},
	// hoverPrimaryColor: {
	// 	type: 'string'
	// },
	// hoverSecondaryColor: {
	// 	type: 'string'
	// }
};

export default attributes;
