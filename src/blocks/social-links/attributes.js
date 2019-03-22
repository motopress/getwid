const { __ } = wp.i18n;

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

	
	align: {
		type: 'string'
	},
	textAlignmentDesktop: {
		type: 'string'
	},
	textAlignmentTablet: {
		type: 'string'
	},
	textAlignmentMobile: {
		type: 'string'
	},		
	icons: {
		type: 'array',
		default: [
			{ icon: 'fab fa-facebook-f', /* color: '', background: '', */ link: 'https://www.facebook.com/', linkTarget: undefined, rel: '' },
			{ icon: 'fab fa-twitter', /* color: '', background: '', */ link: 'https://twitter.com/', linkTarget: undefined, rel: '' },
			{ icon: 'fab fa-instagram', /* color: '', background: '', */ link: 'https://www.instagram.com/', linkTarget: undefined, rel: '' },
			{ icon: 'fab fa-youtube', /* color: '', background: '', */ link: 'https://www.youtube.com/', linkTarget: undefined, rel: '' },
		],
		source: 'query',
		selector: '.wp-block-getwid-social-links__link',
		query:{
			icon:{
				source: 'attribute',
				selector: 'i',
				attribute: 'class',
			},
			title:{
				type: 'string',
				source: 'html',
				selector: '.wp-block-getwid-social-links__label',
			},
/* 			color:{
				source: 'attribute',
				selector: 'i',
				attribute: 'data-color',
			},
			background:{
				source: 'attribute',
				selector: 'i',
				attribute: 'data-bg-color',
			}, */
			link:{
				source: 'attribute',
				attribute: 'href',
				type: 'string',
				default: '#'
			},
			linkTarget:{
				source: 'attribute',
				attribute: 'target',
			},			
			rel:{
				source: 'attribute',
				attribute: 'rel',
			},
		},
	},
	iconsStyle: {
		type: 'string',
		default: 'default',
	},	
	iconsSize: {
		type: 'number',
	},
	iconsSpacing: {
		type: 'string',
		default: 'default',
	},
};

export default attributes;