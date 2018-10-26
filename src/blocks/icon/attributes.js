const attributes = {
	// id: {
	// 	type: 'string'
	// },
	icon: {
		type: 'string',
		default: 'fab fa-angellist'
	},
	style: {
		type: 'string',
	},
	primaryColor: {
		type: 'string',
	},
	secondaryColor: {
		type: 'string',
	},
	iconSize: {
		type: 'string',
	},
	padding: {
		type: 'number',
	},
	borderWidth: {
		type: 'number',
	},
	borderRadius: {
		type: 'number',
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
