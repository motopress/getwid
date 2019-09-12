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
		selector: '.wp-block-getwid-image-hotspot__wrapper img',
		attribute: 'src',
	},
	alt: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-image-hotspot__wrapper img',
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
		default: 'fas fa-plus',
	},
	dotSize: {
		type: 'number',
		default: 16,
	},
	dotPaddings: {
		type: 'number',
		default: 6,
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
		type: 'string',
		default: 'pulse',
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
