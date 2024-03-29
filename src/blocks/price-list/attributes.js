const attributes = {
	align: {
		type: 'string'
	},
	textColor: {
		type: 'string'
	},
	customTextColor: {
		type: 'string'
	},
	title: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-list__title'
	},
	amount: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-list__amount'
	},
	currency: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-list__currency'
	},
	description: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-list__description'
	},
	dotted: {
		type: 'boolean',
		default: true
	},
	id: {
		type: 'number'
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-price-list__image',
		attribute: 'src'
	},
	titleTag: {
		type: 'string',
		default: 'p'
	},
	currencyPosition: {
		type: 'string',
		default: 'currency-before'
	}
};

export default attributes;