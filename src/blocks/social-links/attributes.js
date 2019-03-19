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