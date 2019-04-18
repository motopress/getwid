const attributes = {
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

	/* #region new attributes */
	diameter: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-circle-progress-bar__wrapper',
		attribute: 'data-diameter',
		default: '100'
	},
	thickness: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-circle-progress-bar__wrapper',
		attribute: 'data-thickness',
		default: 'auto'
	},
	/* #endregion */
};

export default attributes;