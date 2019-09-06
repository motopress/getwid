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
		source: 'attribute',
		selector: '.wp-block-getwid-image-hotspot',
		attribute: 'data-trigger',
		default: 'hover'
	},		
	tooltipTheme: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-image-hotspot',
		attribute: 'data-theme',
		default: 'light'
	},	
	tooltipArrow: {
		type: 'boolean',
		default: true,
	},
	tooltipAnimation: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-image-hotspot',
		attribute: 'data-tooltip-animation',
		default: 'shift-toward'
	},		
	dotIcon: {
		type: 'string',
		default: 'fas fa-circle',
	},	
	dotSize: {
		type: 'number',
		default: 14,
	},
	dotPaddings: {
		type: 'number',
		default: 4,
	},	
	dotColor: {
		type: 'string'
	},	
	dotBackground: {
		type: 'string'
	},
	dotOpacity: {
		type: 'number',
		default: 100,
	},	
	dotPulse: {
		type: 'boolean',
		default: false,
	},

	align: {
		type: 'string'
	},
	hoverAnimation: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-image-hotspot',
		attribute: 'data-animation',
		default: ''
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