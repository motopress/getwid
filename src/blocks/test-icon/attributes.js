const attributes = {
    boolAttr: {
        type: 'boolean',
    },

    textAttr: {
        type: 'string',
    },

    imgAttr: {
		type: 'array',
		default: [],
		source: 'query',
		selector: '.wp-block-getwid-test-icon',
		query:{
			url:{
				source: 'attribute',
				selector: 'img',
				attribute: 'src',
			},
			id:{
				source: 'attribute',
				selector: 'img',
				attribute: 'data-id',
			},
		},
    },    
    
    // imgAttr: {
    //     type: 'object',
    // },
    
    ids: {
		type: 'array',
		default: [],
	},

    numAttr: {
        type: 'number',
    },

    selectAttr: {
        type: 'string',
        default: 'all'
    },

    //************************************************** */
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
		default: 'large',
	},
    //************************************************** */
};

export default attributes;