const attributes = {
	mediaAlt: {
		type: 'string',
		source: 'attribute',
		selector: 'figure img',
		attribute: 'alt',
		default: '',
	},
	mediaId: {
		type: 'number',
	},
	mediaUrl: {
		type: 'string',
		source: 'attribute',
		selector: 'figure video,figure img',
		attribute: 'src',
	},
	mediaType: {
		type: 'string',
	},
	innerParent: {
		type: 'object',
	},
	/* #region new code */
	caption: {
		type: 'string',
		default: ''
	}
	/* #endregion */
};

export default attributes;