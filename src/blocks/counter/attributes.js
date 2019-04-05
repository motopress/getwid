const Attributes = {
	align: {
		type: 'string'
	},
	title: {
		type: 'string',
		source: 'html',
		selector: 'h5',
	},
	textColor: {
		type: 'string'
	},
	customTextColor: {
		type: 'string'
	},
	start: {
		type: 'string',
		default: '0'
	},	
	duration: {
		type: 'string',
		default: '3'
	},
	useEasing: {
		type: 'boolean',
		default: true
	},
	useGrouping: {
		type: 'boolean',
		default: true
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
		type: 'string'
	},
	suffix: {
		type: 'string'
	},
	end: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-counter__wrapper',
		attribute: 'data-end',
		default: '150'
	},
	decimalPlaces: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-counter__wrapper',
		attribute: 'data-decimal-places',
		default: '0'
	},
	easing: {
		type: 'type',
		source: 'attribute',
		selector: '.wp-block-getwid-counter__wrapper',
		attribute: 'data-easing-fn',
		default: 'outExpo'
	},
	numerals: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-counter__wrapper',
		attribute: 'data-numerals',
		default: 'default'
	}	
};

export default Attributes;