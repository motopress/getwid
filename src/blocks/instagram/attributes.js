const attributes = {
	photoCount: {
		type: 'number',
		default: 6,
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
	spacing: {
		type: 'string',
		default: 'default',
	},	
	align: {
		type: 'string',
	},
};
export default attributes;