const attributes = {
	align: {
		type: 'string'
	},
	titles: {
		type: 'array',
		selector: '.wp-block-getwid-accordion__header-title',
		source: 'query',
		query: {
			content: {
				type: 'string',
				source: 'html',
			}
		},
		default: []
	},
	items: {
		type: "array",
		source: 'query',
		selector: '.wp-block-getwid-accordion__content',
		query: {
			content: {
				type: 'string',
				source: 'html',
			}
		},
		default: []
	},
	active: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-accordion',
		attribute: 'data-active-element',
		default: '0'
	},
	iconPosition: {
		type: 'string',
		default: 'left'
	},
	heightStyle: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-accordion',
		attribute: 'data-height-style',
		default: 'content'
	},
	headerTag: {
		type: 'string',
		default: 'span'
	},		
};

export default attributes;