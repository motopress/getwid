const attributes = {
	outerParent: {
		type: 'object'
	},
	title: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-tabs-item__title',
	},
	icon: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-tabs-item__icon i',
		attribute: 'class',
		default: 'fas fa-home'
	},
};

export default attributes;