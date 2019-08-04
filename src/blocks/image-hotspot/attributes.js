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
		selector: '.wp-block-getwid-image-hotspot__image-wrapper img',
		attribute: 'src',
	},
	alt: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-image-hotspot__image-wrapper img',
		attribute: 'alt',
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

	align: {
		type: 'string'
	},
	hoverAnimation: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-image-hotspot',
		attribute: 'data-animation'
	},
	imagePoints: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-image-hotspot',
		attribute: 'data-image-points',
		default: '',
	},	
};

export default attributes;