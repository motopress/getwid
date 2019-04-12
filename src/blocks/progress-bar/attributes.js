const Attributes = {
	align: {
		type: 'string'
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
	barColor: {
		type: 'string',
	},
	fillAmount: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-progress-bar .wp-block-getwid-progress-bar__wrapper',
		attribute: 'data-fill-amount',
		default: '75'
	},
	title: {
		type: 'string',
		source: 'html',
		selector: 'h5',
	},
	isAnimated: {
		type: 'boolean',
		// source: 'attribute',
		// selector: '.wp-block-getwid-progress-bar .wp-block-getwid-progress-bar__wrapper',
		// attribute: 'data-is-animated',
		default: false
	},
	typeBar: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-progress-bar .wp-block-getwid-progress-bar__wrapper',
		attribute: 'data-type-bar',
		default: 'default'
	}
};

export default Attributes;