const attributes = {
	headings: {
		type: 'array',
		default: [],
	},
	allowedTags: {
		type: "array",
		default: Array(6).fill(true)
	},
	align: {
		type: 'string',
		default: 'none',
	},
	listStyle: {
		type: 'string',
		default: 'default',
	},
};

export default attributes;
