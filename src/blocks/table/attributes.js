const attributes = {
	align: {
		type: 'string'
	},
	body: {
		type: 'array',
		source: 'query',
		selector: 'tbody tr',
		query: {
			cells: {
				type: 'array',			
				source: 'query',
				selector: 'td',
				query: {
					content: {
						source: 'html'
					},
					colSpan: {
						type: 'string',
						source: 'attribute',
						attribute: 'colspan'
					},
					rowSpan: {
						type: 'string',
						source: 'attribute',
						attribute: 'rowspan'
					}
				},
				default: []
			}
		},
		default: []
	},
	isPreview: {
		type: 'boolean',
		default: false
	}
}

export default attributes;