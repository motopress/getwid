const attributes = {
	align: {
		type: 'string'
	},
	outerParent: {
		type: 'object'
	},
	title: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-toggle-item__header-title',
	},
	active: {
		type: 'boolean',
		default: false
	},
};

export default attributes;