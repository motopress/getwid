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
	textAlignment: {
		type: 'string',
		default: 'center',
	},
	icon: {
		type: 'string',
		default: 'fab fa-wordpress'
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
	align: {
		type: 'string'
	},
	hoverAnimation: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-icon-box',
		attribute: 'data-animation'
	},

    linkTarget: {
        type: 'string',
        source: 'attribute',
        selector: 'a.wp-block-getwid-icon-box__icon-wrapper',
        attribute: 'target',
    },
    rel: {
        type: 'string',
        source: 'attribute',
        selector: 'a.wp-block-getwid-icon-box__icon-wrapper',
        attribute: 'rel',
    }
};

export default attributes;
