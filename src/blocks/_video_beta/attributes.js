const attributes = {
	id: {
		type: 'number',
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-banner__video',
		attribute: 'src',
	},	
	link: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-banner a',
		attribute: 'href',
	},
	newWindow: {
		type: 'boolean',
		default: false,
	},		
	align: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	overlayColor: {
		type: 'string',
	},
	backgroundOpacity: {
		type: 'number',
		default: 35,
	},
};

export default attributes;