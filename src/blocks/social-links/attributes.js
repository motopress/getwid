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
			{ icon: 'fab fa-facebook-f', title: 'Facebook', color: '', link: '#' },
			{ icon: 'fab fa-google-plus-g', title: 'Google+', color: '', link: '#' },
			{ icon: 'fab fa-instagram', title: 'Instagram', color: '', link: '#' },
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