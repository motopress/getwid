const attributes = {
	textColor: {
		type: 'string',
	},
	backgroundColor: {
		type: 'string'
	},
	customBackgroundColor: {
		type: 'string'
	},
	customTextColor: {
		type: 'string'
	},
	cardPosition: {
		type: 'string',
		default: ''
	},
	animation: {
		type: 'string',
		default: 'none'
	},
	meta: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-vertical-timeline-item__meta-content'
	},
	imageSize: {
		type: 'string',
		default: 'large'
	},
	id: {
		type: 'number'
	},
	alt:{
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-vertical-timeline-item__image',
		attribute: 'alt',
		default: '',
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-vertical-timeline-item__image',
		attribute: 'src'
	},
	pointColor: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-vertical-timeline-item__point',
		attribute: 'data-point-color'
	}
};

export default attributes;