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
	id: {
		type: 'number'
	},
	url: {
		type: 'string',
		source: 'attribute',
		attribute: 'src',
		selector: '.wp-block-getwid-testimonial__image img'
	},
	alt: {
		type: 'string',
		source: 'attribute',
		attribute: 'alt',
		selector: '.wp-block-getwid-testimonial__image img'
	}

};

export default attributes;