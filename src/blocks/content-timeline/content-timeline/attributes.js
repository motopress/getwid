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
	paddingTop: {
		type: 'string'
	},
	paddingBottom: {
		type: 'string'
	},
	paddingLeft: {
		type: 'string'
	},
	paddingRight: {
		type: 'string'
	},
	fillColor: {
		type: 'string'
	},
	customFillColor: {
		type: 'string'
	},
	animation: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-timeline',
		attribute: 'data-animation',
		default: 'none'
	},
	filling: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-timeline',
		attribute: 'data-filling',
		default: 'false'
	}
};

export default attributes;