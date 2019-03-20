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
	textAlignment: {
		type: 'string'
	},
	icons: {
		type: 'array',
		default: [
			{ icon: 'fab fa-facebook-f', title: __('Facebook', 'getwid'), color: '', background: '', link: '#', linkTarget: undefined, rel: '' },
			{ icon: 'fab fa-twitter', title: __('Twitter', 'getwid'), color: '', background: '', link: '#', linkTarget: undefined, rel: '' },
			{ icon: 'fab fa-instagram', title: __('Instagram', 'getwid'), color: '', background: '', link: '#', linkTarget: undefined, rel: '' },
			{ icon: 'fab fa-youtube', title: __('YouTube', 'getwid'), color: '', background: '', link: '#', linkTarget: undefined, rel: '' },
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