const attributes = {
	align: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-circle-progress-bar',
	},
	wrapperAlign: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-circle-progress-bar__wrapper',
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