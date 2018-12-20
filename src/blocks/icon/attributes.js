const attributes = {

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


	// id: {
	// 	type: 'string'
	// },
	icon: {
		type: 'string',
		default: 'fab fa-wordpress'
	},
	iconStyle: {
		type: 'string',
		default: 'default',
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
	newWindow: {
		type: 'boolean',
		default: false,
	},
	align: {
		type: 'string'
	},
	textAlignment: {
		type: 'string',
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
