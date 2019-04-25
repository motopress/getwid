const attributes = {
	align: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-price-box',
	},
	backgroundColor: {
		type: 'string'
	},
	textColor: {
		type: 'string'
	},
	customBackgroundColor: {
		type: 'string'
	},
	customTextColor: {
		type: 'string'
	},
	title: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-box__title'
	},
	currency: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-box__currency'
	},
	amount: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-box__amount'
	},
	period: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-box__period'
	},
	features: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-box__features'
	}
};

export default attributes;