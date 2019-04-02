const { __ } = wp.i18n;

const attributes = {
	getDataFrom: {
		type: 'string',
		default: 'self',
	},
	userName: {
		type: 'string',
	},
	tagName: {
		type: 'string',
	},	
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
	linkTo: {
		type: 'string',
		default: 'image',
	},	
	showLikes: {
		type: 'boolean',
		default: true,
	},
	showComments: {
		type: 'boolean',
		default: true,
	},
	blockAlignment: {
		type: 'string',
	},
};
export default attributes;