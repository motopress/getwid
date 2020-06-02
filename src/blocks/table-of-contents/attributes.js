const attributes = {
	headings: {
		type: 'array',
		default: [],
	},
	allowedTags: {
		type: "array",
		default: Array(5).fill(true)
	},
	align: {
		type: 'string',
		default: 'none',
	},
	listStyle: {
		type: 'string',
		default: 'none',
	},
};

export default attributes;
