const attributes = {
	align: {
		type: 'string'
	},
	titles: {
		type: 'array',
		selector: '.wp-block-getwid-toggle__header-title',
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
		selector: '.wp-block-getwid-toggle__content',
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
		selector: '.wp-block-getwid-toggle',
		attribute: 'data-active-element',
		default: 'false'
	},
	iconPosition: {
		type: 'string',
		default: 'left'
	},
	headerTag: {
		type: 'string',
		default: 'span'
	},		
};

export default attributes;