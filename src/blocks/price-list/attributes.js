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
	titleTag: {
		type: 'string',
		default: 'p'
	},
	id: {
		type: 'number',
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-price-list__image-wrapper img',
		attribute: 'src',
	}
};

export default attributes;