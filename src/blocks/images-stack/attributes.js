const attributes = {
	align: {
		type: 'string',
	},
	images: {
		type: 'array',
		default: [],
		source: 'query',
		selector: '.wp-block-getwid-images-stack .wp-block-getwid-images-stack__media-wrapper',
		query:{
			url:{
				source: 'attribute',
				selector: 'img',
				attribute: 'src',
			},
			original_url:{
				source: 'attribute',
				selector: 'a',
				attribute: 'href',
			},			
			link:{
				source: 'attribute',
				selector: 'img',
				attribute: 'data-link',
			},
			alt:{
				source: 'attribute',
				selector: 'img',
				attribute: 'alt',
				default: '',
			},
			id:{
				source: 'attribute',
				selector: 'img',
				attribute: 'data-id',
			},
			caption:{
				type: 'string',
				source: 'html',
				selector: 'figcaption',
			},
		},
	},
	ids: {
		type: 'array',
		default: [],
	},
	imageSize: {
		type: 'string',
		default: 'full'
	},	
	linkTo: {
		type: 'string',
		default: 'none',
	},
	stackStyle: {
		type: 'string',
		default: 'default',
	},
	stackOverlap: {
		type: 'string',
		default: 'default',
	},	
};

export default attributes;