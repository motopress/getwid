const attributes = {
	imageSize: {
		type: 'string',
		default: 'large',
	},
	imageCrop: {
		type: 'boolean',
		default: true,
	},	
	title: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-person__title'
	},
	subtitle: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-person__subtitle'
	},
	content: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-person__content'
	},
	id: {
		type: 'number'
	},
	url: {
		type: 'string',
		source: 'attribute',
		attribute: 'src',
		selector: '.wp-block-getwid-person__image img'
	},
	alt:{
		type: 'string',
		source: 'attribute',
		attribute: 'alt',
		selector: '.wp-block-getwid-person__image img'
	}

};

export default attributes;