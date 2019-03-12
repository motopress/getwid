const attributes = {
	imageSize: {
		type: 'string',
		default: 'large',
	},	
	id: {
		type: 'number',
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-image-box__image-wrapper img',
		attribute: 'src',
	},
	alt: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-image-box__image-wrapper img',
		attribute: 'alt',
	},

	textAlignment: {
		type: 'string',
		default: 'center',
	},
	layout: {
		type: 'string',
	},		
	imagePosition: {
		type: 'string',
		default: 'top',
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

	link: {
		type: 'string',
		source: 'attribute',
		selector: 'a.wp-block-getwid-image-box__image-wrapper',
		attribute: 'href'
	},
	align: {
		type: 'string'
	},
	hoverAnimation: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-image-box',
		attribute: 'data-animation'
	},
    mobileLayout: {
        type: 'string',
        default: 'default'
    },
    mobileAlignment: {
        type: 'string',
        default: 'default'
    },


	linkTarget: {
		type: 'string',
		source: 'attribute',
		selector: 'a.wp-block-getwid-image-box__image-wrapper',
		attribute: 'target',
	},
	rel: {
		type: 'string',
		source: 'attribute',
		selector: 'a.wp-block-getwid-image-box__image-wrapper',
		attribute: 'rel',
	}
};

export default attributes;
