const { __ } = wp.i18n;

const attributes = {
	photoCount: {
		type: 'number',
		default: 10,
	},
	displayStyle: {
		type: 'string',
		default: 'grid',
	},
	gridColumns: {
		type: 'number',
		default: 3,
	},	
	showLikes: {
		type: 'boolean',
		default: true,
	},
	showComments: {
		type: 'boolean',
		default: true,
	},
	align: {
		type: 'string',
	},
};
export default attributes;