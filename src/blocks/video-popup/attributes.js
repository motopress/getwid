const attributes = {
	//Title
	titleColor: {
		type: 'string',
	},
	customTitleColor: {
		type: 'string',
	},
	//Sub title
	subtitleColor: {
		type: 'string',
	},
	customSubtitleColor: {
		type: 'string',
	},
	//Icon
	iconColor: {
		type: 'string',
	},
	customIconColor: {
		type: 'string',
	},
	//Button
	buttonColor: {
		type: 'string',
	},
	customButtonColor: {
		type: 'string',
	},
	//Overlay
	overlayColor: {
		type: 'string',
	},
	customOverlayColor: {
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
	buttonMaxWidth: {
		type: 'string',
	},

	backgroundOpacity: {
		type: 'number',
		default: 35,
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