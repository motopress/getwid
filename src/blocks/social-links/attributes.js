const { __ } = wp.i18n;

const attributes = {
	align: {
		type: 'string'
	},
	textAlign: {
		type: 'string'
	},
	icons: {
		type: 'array',
		default: [
			{ icon: 'fab fa-facebook-f', title: __('Facebook', 'getwid'), color: '', link: '#' },
			{ icon: 'fab fa-google-plus-g', title: __('Google+', 'getwid'), color: '', link: '#' },
			{ icon: 'fab fa-instagram', title: __('Instagram', 'getwid'), color: '', link: '#' },
		],
	},
	iconsColor: {
		type: 'string',
	},	
	iconsSize: {
		type: 'number',
		default: 24,
	},
	iconsSpacing: {
		type: 'string',
		default: 'small',
	},
};

export default attributes;