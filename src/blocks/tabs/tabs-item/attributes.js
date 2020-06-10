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
		selector: '.wp-block-getwid-tabs-item__title',
	},
};

export default attributes;