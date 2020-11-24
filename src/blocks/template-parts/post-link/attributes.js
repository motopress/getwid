import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const attributes = {
	//Colors
	textColor: {
		type: 'string',
	},
	customTextColor: {
		type: 'string',
	},
	buttonText: {
		type: 'string',
		default: __('Read More', 'getwid'),
	},
	align: {
		type: 'string',
	},
	textAlignment: {
		type: 'string',
	},	
};
export default attributes;