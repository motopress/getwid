const attributes = {
	align: {
		type: 'string'
	},
	backgroundColor: {
		type: 'string',
	},
	customBackgroundColor: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	customTextColor: {
		type: 'string',
	},
	fillAmount: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-circle-progress-bar__wrapper',
		attribute: 'data-fill-amount',
		default: '75'
	},
	title: {
		type: 'string',
		source: 'html',
		selector: 'h5',
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