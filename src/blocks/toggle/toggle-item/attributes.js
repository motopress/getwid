const attributes = {
	outerParent: {
		type: 'object'
	},
	title: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-toggle__header-title',
	},
	active: {
		type: 'boolean',
		default: false
	},
};

export default attributes;
