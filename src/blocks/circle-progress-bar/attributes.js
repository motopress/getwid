const attributes = {
	align: {
		type: 'string'
	},
	wrapperAlign: {
		type: 'string'
	},
	backgroundColor: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-circle-progress-bar__wrapper',
		attribute: 'data-background-color',
	},
	textColor: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-circle-progress-bar__wrapper',
		attribute: 'data-text-color',
	},
	fillAmount: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-circle-progress-bar__wrapper',
		attribute: 'data-fill-amount',
		default: '75'
	},
	value: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-circle-progress-bar__wrapper',
		attribute: 'data-value'
	},
	isAnimated: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-circle-progress-bar__wrapper',
		attribute: 'data-is-animated',
		default: 'true'
	},
	size: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-circle-progress-bar__wrapper',
		attribute: 'data-size',
		default: '200'
	},
	thickness: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-circle-progress-bar__wrapper',
		attribute: 'data-thickness',
		default: 'auto'
	}
};

export default attributes;