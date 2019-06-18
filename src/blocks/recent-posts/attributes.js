const attributes = {
	//Posts settings
	className: {
		type: 'string',
	},	
	titleTag: {
		type: 'string',
		default: 'h3',
	},
	imageSize: {
		type: 'string',
		default: 'large',
	},
	cropImages: {
		type: 'boolean',
		default: true,
	},		
	categories: {
		type: 'string',
	},
	postsToShow: {
		type: 'number',
		default: 5,
	},
	showTitle: {
		type: 'boolean',
		default: true,
	},
	showDate: {
		type: 'boolean',
		default: false,
	},
	showCategories: {
		type: 'boolean',
		default: false,
	},
	showCommentsCount: {
		type: 'boolean',
		default: false,
	},
	showContent: {
		type: 'boolean',
		default: false,
	},
	contentLength: {
		type: 'number',
		default: 55,
	},
	showFeaturedImage: {
		type: 'boolean',
		default: false,
	},
	postLayout: {
		type: 'string',
		default: 'list',
	},
	columns: {
		type: 'number',
		default: 3,
	},
	align: {
		type: 'string',
	},
	order: {
		type: 'string',
		default: 'desc',
	},
	orderBy: {
		type: 'string',
		default: 'date',
	},	
};
export default attributes;