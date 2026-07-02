const attributes = {
	align: {
		type: 'string'
	},
	active: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-accordion',
		attribute: 'data-active-element',
		default: 'none'
	},
	iconPosition: {
		type: 'string',
		default: 'left'
	},
	iconOpen: {
		type: 'string',
		default: 'fas fa-minus'
	},
	iconClose: {
		type: 'string',
		default: 'fas fa-plus'
	},
	headerTag: {
		type: 'string',
		default: 'span'
	},
};

export default attributes;