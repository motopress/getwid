const attributes = {
	postTemplate: {
		type: 'string',
	},

	//Custom Post Type
	postsToShow: {
		type: 'number',
		default: 5,
	},
	pagination: {
		type: 'boolean',
		default: false,
	},	
	ignoreSticky: {
		type: 'boolean',
		default: true,
	},	
	filterById: {
		type: 'string',
	},	
	parentPageId: {
		type: 'string',
	},	
	postType: {
		type: 'string',
	},
	taxonomy: {
		type: 'array',
		items: {
			type: 'string',
		}
	},
	terms: {
		type: 'array',
		items: {
			type: 'string',
		}
	},	
	relation: {
		type: 'string',
		default: 'AND',
	},
	order: {
		type: 'string',
		default: 'desc',
	},
	orderBy: {
		type: 'string',
		default: 'date',
	},
	//Custom Post Type


	postLayout: {
		type: 'string',
		default: 'list',
	},
	columns: {
		type: 'number',
		default: 3,
	},
	spacing: {
		type: 'string',
		default: 'default',
	},
	align: {
		type: 'string',
	},
	
	className: {
		type: 'string',
	},	
	anchor: {
		type: 'string',
	},	
};
export default attributes;