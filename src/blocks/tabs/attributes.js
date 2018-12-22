const attributes = {
	titles: {
		type: 'array',
		selector: '.wp-block-getwid-tabs__nav-link a',
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
		selector: '.wp-block-getwid-tabs__tab-content',
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
		selector: '.wp-block-getwid-tabs',
		attribute: 'data-active-tab',
	},
	type: {
		type: 'string',
	},
	headerTag: {
		type: 'string',
		default: 'span'
	},	
};

export default attributes;