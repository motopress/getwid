const { __ } = wp.i18n;

const attributes = {
	align: {
		type: 'string'
	},
	textAlignment: {
		type: 'string'
	},
	icons: {
		type: 'array',
		default: [
			{ icon: 'fab fa-facebook-f', title: __('Facebook', 'getwid'), color: '', background: '', link: '#', linkTarget: undefined, rel: 'noreferrer noopener' },
			{ icon: 'fab fa-google-plus-g', title: __('Google+', 'getwid'), color: '', background: '', link: '#', linkTarget: undefined, rel: 'noreferrer noopener' },
			{ icon: 'fab fa-instagram', title: __('Instagram', 'getwid'), color: '', background: '', link: '#', linkTarget: undefined, rel: 'noreferrer noopener' },
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
				selector: 'span',
			},
			color:{
				source: 'attribute',
				selector: 'i',
				attribute: 'data-color',
			},
			background:{
				source: 'attribute',
				selector: 'i',
				attribute: 'data-bg-color',
			},
			link:{
				source: 'attribute',
				// selector: 'a',
				attribute: 'href',
				type: 'string',
				default: '#'
			},
			linkTarget:{
				source: 'attribute',
				// selector: 'a',
				attribute: 'target',
			},			
			rel:{
				source: 'attribute',
				// selector: 'a',
				attribute: 'rel',
			},
		},
	},
	iconsColor: {
		type: 'string',
	},
	iconsBgColor: {
		type: 'string',
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
		default: 'medium',
	},
};

export default attributes;