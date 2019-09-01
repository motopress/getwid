const attributes = {
	align: {
		type: 'string'
	},
	wrapperAlign: {
		type: 'string'
	},
	textColor: {
		type: 'string',
	},
	backgroundColor: {
		type: 'string'
	},
	customTextColor: {
		type: 'string'
	},
	customBackgroundColor: {
		type: 'string'
	},
	fillColor: {
		type: 'string'
	},
	customFillColor: {
		type: 'string'
	},
	itemsCount: {
		type: 'number',
		default: 1
	},
	animation: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-vertical-timeline',
		attribute: 'data-animation',
		default: 'none'
	},
	filling: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-vertical-timeline',
		attribute: 'data-filling',
		default: 'false'
	}
};

export default attributes;