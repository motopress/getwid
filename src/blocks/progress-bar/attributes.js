const attributes = {
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
		type: 'number',
		default: 75
	},
	title: {
		type: 'string',
		source: 'html',
		selector: 'h5',
	}
};

export default attributes;