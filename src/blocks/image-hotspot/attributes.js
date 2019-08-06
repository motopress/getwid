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

	//Tooltips
	tooltipTrigger: {
		type: 'string',
		default: 'hover'
	},		
	tooltipTheme: {
		type: 'string',
		default: 'light'
	},	
	tooltipPlacement: {
		type: 'string',
		default: 'top'
	},
	tooltipArrow: {
		type: 'boolean',
		default: true,
	},
	tooltipAnimation: {
		type: 'string',
		default: 'shift-toward'
	},		
	dotSize: {
		type: 'number',
		default: 20,
	},
	dotColor: {
		type: 'string'
	},	
	dotBackground: {
		type: 'string'
	},
	dotPulse: {
		type: 'boolean',
		default: true,
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
		attribute: 'data-animation',
		default: 'rubberBand'
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