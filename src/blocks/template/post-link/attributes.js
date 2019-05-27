import { __ } from 'wp.i18n';

const attributes = {
	//Colors
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


	buttonText: {
		type: 'string',
		default: __('Read More', 'getwid'),
	},
	align: {
		type: 'string',
	},
	textAlignment: {
		type: 'string',
		default: 'left',
	},	
};
export default attributes;