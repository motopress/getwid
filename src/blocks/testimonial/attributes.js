const attributes = {
	title: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-testimonial__title'
	},
	subtitle: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-testimonial__subtitle'
	},
	content: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-testimonial__content'
	},
	imgId: {
		type: 'string'
	},
	imgSize: {
		type: 'string'
	},
	imgUrl: {
		type: 'string'
	}

};

export default attributes;