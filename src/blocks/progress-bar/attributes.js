const attributes = {
	align: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-progress-bar',
	},
	backgroundColor: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	customBackgroundColor: {
		type: 'string',
	},
	customTextColor: {
		type: 'string',
	},
	fillAmount: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-progress-bar__wrapper',
		attribute: 'data-fill-amount',
		default: '75'
	},
	title: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-progress-bar__title',
	},
	isAnimated: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-progress-bar__wrapper',
		attribute: 'data-is-animated',
		default: 'true'
	}
};

export default attributes;