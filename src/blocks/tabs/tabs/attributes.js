const attributes = {
	align: {
		type: 'string',
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
};

export default attributes;