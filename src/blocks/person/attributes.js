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
	imgId: {
		type: 'string'
	},
	imgSize: {
		type: 'string'
	},
	imgUrl: {
		type: 'string'
	},
	textAlignment:{
		type: 'string'
	}

};

export default attributes;