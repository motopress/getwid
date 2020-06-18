const attributes = {
	outerParent: {
		type: 'object'
	},
	title: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-tabs__title',
	},
};

export default attributes;