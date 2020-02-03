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
	icon: {
		type: 'string',
		default: 'fab fa-wordpress'
	},
	iconStyle: {
		type: 'string',
		default: 'default',
	},
	iconSize: {
		type: 'string',
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
		selector: 'a.wp-block-getwid-icon__wrapper',
		attribute: 'href'
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

    linkTarget: {
        type: 'string',
        source: 'attribute',
        selector: 'a.wp-block-getwid-icon__wrapper',
        attribute: 'target',
    },
    rel: {
        type: 'string',
        source: 'attribute',
        selector: 'a.wp-block-getwid-icon__wrapper',
        attribute: 'rel',
    }
};

export default attributes;
