const attributes = {
	backgroundColor: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	customBackgroundColor: {
		type: 'string',
	},
	customTextColor: {
		type: 'string',
	},

	videoAutoplay: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-banner__source',
		attribute: 'autoplay',
		default: true,
	},
	imageSize: {
		type: 'string',
		default: 'full',
	},	
	id: {
		type: 'number',
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-banner__source',
		attribute: 'src',
	},	
	type: {
		type: 'string',
		default: 'image',
	},	
	title: {
		type: 'string',
		source: 'html',
		selector: 'span',
	},
	text: {
		type: 'string',
		source: 'html',
		selector: 'p',
	},	
	link: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-banner a',
		attribute: 'href',
	},
	align: {
		type: 'string',
	},
	minHeight: {
		type: 'string',
	},
	contentMaxWidth: {
		type: 'string',
	},		
	verticalAlign: {
		type: 'string',
		default: 'center',
	},
	horizontalAlign: {
		type: 'string',
		default: 'center',
	},
	backgroundOpacity: {
		type: 'number',
		default: 35,
	},

	blockAnimation: {
		type: 'string',
		default: 'style4',
	},
	textAnimation: {
		type: 'string',
		default: 'opacity-bottom',
	},
    linkTarget: {
        type: 'string',
        source: 'attribute',
        selector: '.wp-block-getwid-banner__link',
        attribute: 'target',
    },
    rel: {
        type: 'string',
        source: 'attribute',
        selector: '.wp-block-getwid-banner__link',
        attribute: 'rel',
    },
};

export default attributes;