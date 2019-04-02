const Attributes = {
	start: {
		type: 'string',
		default: '0'
	},
	end: {
		type: 'string',
		default: '100'
	},
	decimalPlaces: {
		type: 'string',
		default: '0'
	},
	duration: {
		type: 'string',
		default: '3'
	},
	useEasing: {
		type: 'boolean',
		default: false
	},
	useGrouping: {
		type: 'boolean',
		default: false
	},
	separator: {
		type: 'string',
		default: ','
	},
	decimal: {
		type: 'string',
		default: '.'
	},
	prefix: {
		type: 'string',
		default: 'Up to'
	},
	suffix: {
		type: 'string',
		default: '+'
	},
	easing: {
		type: 'type'
	},
	numerals: {
		type: 'string',
		default: 'default'
	},
	align: {
		type: 'string'
	},
	title: {
		type: 'string',
		source: 'html',
		selector: 'h5',
	},
};

export default Attributes;