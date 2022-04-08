const attributes = {
	postTemplate: {
		type: 'string',
	},

	//Custom Post Type
	postsToShow: {
		type: 'number',
		default: 5,
	},
	offset: {
		type: 'number',
		default: 0,
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
	excludeById: {
		type: 'string',
	},
	excludeCurrentPost: {
		type: 'boolean',
		default: false,
	},
	childPagesCurrentPage: {
		type: 'boolean',
		default: false,
	},
	parentPageId: {
		type: 'string',
	},
	postType: {
		type: 'string',
		default: 'post',
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

	//Modal
	metaQuery: {
		type: 'array',
		default: []
	}
};

export default attributes;
