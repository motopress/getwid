const attributes = {
	outerParent: {
		type: 'object'
	},
	title: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-accordion-item__header-title',
	},
};

export default attributes;