const attributes = {
	align: {
		type: 'string'
	},
	active: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-tabs',
		attribute: 'data-active-tab',
	},
	type: {
		type: 'string',
		default: ''
	},
	headerTag: {
		type: 'string',
		default: 'span'
	},
	equalHeight: {
		type: 'boolean',
		default: false
	},
};

export default attributes;