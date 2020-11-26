const attributes = {
	headings: {
		type: 'array',
		default: [],
	},
	allowedTags: {
		type: "array",
		default: Array(6).fill(false, 0, 1).fill(true, 1, 6)
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
