const attributes = {
	id: {
		type: 'number',
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-video__video',
		attribute: 'src',
	},	
	link: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-video a',
		attribute: 'href',
	},
	newWindow: {
		type: 'boolean',
		default: false,
	},		
	align: {
		type: 'string',
	},
	minHeight: {
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