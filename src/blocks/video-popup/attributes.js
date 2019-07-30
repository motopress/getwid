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

	imageSize: {
		type: 'string',
		default: 'large',
	},	
	id: {
		type: 'number',
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-video-popup__source',
		attribute: 'src',
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
		selector: '.wp-block-getwid-video-popup a',
		attribute: 'href',
	},
	align: {
		type: 'string',
	},
	minHeight: {
		type: 'string',
	},

	imageAnimation: {
		type: 'string',
		default: 'style4',
	},
	buttonAnimation: {
		type: 'string',
		default: 'opacity-bottom',
	},
    linkTarget: {
        type: 'string',
        source: 'attribute',
        selector: '.wp-block-getwid-video-popup__link',
        attribute: 'target',
    },
    rel: {
        type: 'string',
        source: 'attribute',
        selector: '.wp-block-getwid-video-popup__link',
        attribute: 'rel',
    },
};

export default attributes;