const attributes = {
	backgroundColor: {
		type: 'string',
	},
	sliderImages: {
		type: 'array',
		default: [],
		source: 'query',
		selector: '.wp-block-getwid-section__background-slider>.wp-block-getwid-section__background-slider-item',
		query: {
			url: {
				source: 'attribute',
				selector: 'img',
				attribute: 'src',
			},
			alt: {
				source: 'attribute',
				selector: 'img',
				attribute: 'alt',
				default: '',
			},
			id: {
				source: 'attribute',
				selector: 'img',
				attribute: 'data-id',
			},
		},
	},
};

export default attributes;
