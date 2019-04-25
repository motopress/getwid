const attributes = {
	align: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-counter',
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
		type: 'string',
		default: 'true'
	},
	useGrouping: {
		type: 'string',
		default: 'true'
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
		source: 'html',
		selector: '.wp-block-getwid-counter__prefix'
	},
	title: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-counter__title'
	},
	suffix: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-counter__suffix'
	},
	end: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-counter__wrapper',
		attribute: 'data-end',
		default: '100'
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

export default attributes;