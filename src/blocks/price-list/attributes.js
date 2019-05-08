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
		// source: 'html',
		// selector: '.wp-block-getwid-price-list__title'
	},
	amount: {
		type: 'string',
		// source: 'html',
		// selector: '.wp-block-getwid-price-list__amount'
	},
	currency: {
		type: 'string',
		// source: 'html',
		// selector: '.wp-block-getwid-price-list__currency'
	},
	description: {
		type: 'string',
		// source: 'html',
		// selector: '.wp-block-getwid-price-list__description'
	},
	titleTag: {
		type: 'string',
		default: 'p'
	}
};

export default attributes;