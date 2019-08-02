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
	buttonColorHEX: {
		type: 'string',
	},	
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
		selector: '.wp-block-getwid-video-popup__title',
	},
	text: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-video-popup__sub-title',
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

	overlayOpacity: {
		type: 'number',
		default: 35,
	},
	imageAnimation: {
		type: 'string',
		default: 'style4',
	},
	buttonStyle: {
		type: 'string',
		default: 'default',
	},	
	buttonAnimation: {
		type: 'string',
		default: 'none',
	},
	buttonSize: {
		type: 'string',
		default: 'default',
	},	
};

export default attributes;