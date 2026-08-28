import Save from './save';

const deprecated = [
	{
		attributes: {
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
		},
		save: Save,
	},
];

export default deprecated;
