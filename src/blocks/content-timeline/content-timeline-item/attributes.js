const attributes = {
	outerParent: {
		type: 'object'
	},
	cardPosition: {
		type: 'string',
		default: ''
	},
	meta: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-content-timeline-item__meta-content'
	},
	imageSize: {
		type: 'string',
		default: 'full'
	},
	id: {
		type: 'number'
	},
	alt: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-timeline-item__image',
		attribute: 'alt',
		default: ''
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-timeline-item__image',
		attribute: 'src'
	}
};

export default attributes;